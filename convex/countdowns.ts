import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import type { DatabaseReader, MutationCtx, QueryCtx } from './_generated/server'
import type { Doc, Id } from './_generated/dataModel'

function cleanNickname(nickname: string) {
  return nickname.trim()
}

function normalizeNickname(nickname: string) {
  return cleanNickname(nickname).toLowerCase()
}

function cleanOptionalNickname(nickname: string | undefined) {
  const cleanValue = cleanNickname(nickname ?? '')

  return cleanValue.length > 0 ? cleanValue : undefined
}

function assertNickname(nickname: string) {
  const cleanValue = cleanNickname(nickname)

  if (cleanValue.length < 2) {
    throw new Error('El nickname debe tener al menos 2 caracteres.')
  }

  if (cleanValue.length > 32) {
    throw new Error('El nickname no puede tener mas de 32 caracteres.')
  }

  return cleanValue
}

function assertDifferentNicknames(nickname: string, partnerNickname?: string) {
  if (
    partnerNickname &&
    normalizeNickname(nickname) === normalizeNickname(partnerNickname)
  ) {
    throw new Error('Los nicknames deben ser diferentes.')
  }
}

async function getProfileByNickname(db: DatabaseReader, nickname: string) {
  return await db
    .query('profiles')
    .withIndex('by_normalized_nickname', (index) =>
      index.eq('normalizedNickname', normalizeNickname(nickname)),
    )
    .unique()
}

async function buildCountdownState(
  ctx: QueryCtx | MutationCtx,
  profile: Doc<'profiles'> | null,
) {
  const countdown = profile?.countdownId
    ? await ctx.db.get(profile.countdownId)
    : null

  return {
    profile,
    countdown,
  }
}

async function upsertProfile(
  ctx: MutationCtx,
  nickname: string,
  partnerNickname?: string,
) {
  const cleanValue = assertNickname(nickname)
  const cleanPartnerNickname = cleanOptionalNickname(partnerNickname)
  assertDifferentNicknames(cleanValue, cleanPartnerNickname)

  const normalizedNickname = normalizeNickname(cleanValue)
  const existingProfile = await getProfileByNickname(ctx.db, cleanValue)
  const now = Date.now()

  if (existingProfile) {
    await ctx.db.patch(existingProfile._id, {
      nickname: cleanValue,
      normalizedNickname,
      ...(cleanPartnerNickname
        ? { partnerNickname: cleanPartnerNickname }
        : {}),
      updatedAt: now,
    })

    return (await ctx.db.get(existingProfile._id)) as Doc<'profiles'>
  }

  const profileId = await ctx.db.insert('profiles', {
    nickname: cleanValue,
    normalizedNickname,
    ...(cleanPartnerNickname ? { partnerNickname: cleanPartnerNickname } : {}),
    createdAt: now,
    updatedAt: now,
  })

  return (await ctx.db.get(profileId)) as Doc<'profiles'>
}

export const getByNickname = query({
  args: {
    nickname: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanValue = cleanNickname(args.nickname)

    if (!cleanValue) {
      return buildCountdownState(ctx, null)
    }

    const profile = await getProfileByNickname(ctx.db, cleanValue)

    return buildCountdownState(ctx, profile)
  },
})

export const saveProfile = mutation({
  args: {
    nickname: v.string(),
    partnerNickname: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profile = await upsertProfile(
      ctx,
      args.nickname,
      args.partnerNickname,
    )

    return buildCountdownState(ctx, profile)
  },
})

export const createCountdown = mutation({
  args: {
    nickname: v.string(),
    partnerNickname: v.optional(v.string()),
    initialDays: v.number(),
  },
  handler: async (ctx, args) => {
    if (!Number.isInteger(args.initialDays) || args.initialDays < 0) {
      throw new Error(
        'La cantidad de dias debe ser un entero mayor o igual a 0.',
      )
    }

    const profile = await upsertProfile(
      ctx,
      args.nickname,
      args.partnerNickname,
    )
    const now = Date.now()
    const countdownId = await ctx.db.insert('countdowns', {
      initialDays: args.initialDays,
      placedAt: now,
      ownerNickname: profile.nickname,
      createdAt: now,
      updatedAt: now,
    })

    await ctx.db.patch(profile._id, {
      countdownId,
      updatedAt: now,
    })

    const updatedProfile = (await ctx.db.get(profile._id)) as Doc<'profiles'>

    return buildCountdownState(ctx, updatedProfile)
  },
})

function cleanMessage(value: string | undefined, maxLength: number) {
  const cleanValue = (value ?? '').trim()

  if (cleanValue.length > maxLength) {
    throw new Error(`El texto no puede tener mas de ${maxLength} caracteres.`)
  }

  return cleanValue.length > 0 ? cleanValue : undefined
}

export const updateMessages = mutation({
  args: {
    nickname: v.string(),
    eyebrow: v.optional(v.string()),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profile = await getProfileByNickname(ctx.db, args.nickname)

    if (!profile?.countdownId) {
      throw new Error('No hay countdown para editar.')
    }

    await ctx.db.patch(profile.countdownId, {
      eyebrow: cleanMessage(args.eyebrow, 60),
      title: cleanMessage(args.title, 80),
      updatedAt: Date.now(),
    })

    return buildCountdownState(ctx, profile)
  },
})

// Renames the current profile and/or updates its partner pointer. Keeps the
// same countdown link and migrates the sender's own message key on rename.
export const updateProfile = mutation({
  args: {
    currentNickname: v.string(),
    nickname: v.string(),
    partnerNickname: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanValue = assertNickname(args.nickname)
    const cleanPartnerNickname = cleanOptionalNickname(args.partnerNickname)
    assertDifferentNicknames(cleanValue, cleanPartnerNickname)

    const profile = await getProfileByNickname(ctx.db, args.currentNickname)

    if (!profile) {
      throw new Error('No se encontro tu perfil.')
    }

    const newNormalized = normalizeNickname(cleanValue)
    const nicknameChanged = newNormalized !== profile.normalizedNickname

    if (nicknameChanged) {
      const existing = await getProfileByNickname(ctx.db, cleanValue)

      if (existing && existing._id !== profile._id) {
        throw new Error('Ese nickname ya esta en uso.')
      }
    }

    const now = Date.now()
    await ctx.db.patch(profile._id, {
      nickname: cleanValue,
      normalizedNickname: newNormalized,
      partnerNickname: cleanPartnerNickname,
      updatedAt: now,
    })

    // Move the message the user already sent to the new key so it follows them.
    if (nicknameChanged && profile.countdownId) {
      const countdown = await ctx.db.get(profile.countdownId)
      const sent = countdown?.messages?.[profile.normalizedNickname]

      if (countdown?.messages && sent !== undefined) {
        const messages = { ...countdown.messages }
        messages[newNormalized] = sent
        delete messages[profile.normalizedNickname]
        await ctx.db.patch(profile.countdownId, { messages, updatedAt: now })
      }
    }

    const updatedProfile = (await ctx.db.get(profile._id)) as Doc<'profiles'>

    return buildCountdownState(ctx, updatedProfile)
  },
})

// Sends a directional message to the partner. The text is stored under the
// sender's normalized nickname; the partner's device reads that entry.
export const sendMessage = mutation({
  args: {
    nickname: v.string(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profile = await getProfileByNickname(ctx.db, args.nickname)

    if (!profile?.countdownId) {
      throw new Error('No hay countdown para editar.')
    }

    const countdown = await ctx.db.get(profile.countdownId)

    if (!countdown) {
      throw new Error('No hay countdown para editar.')
    }

    const key = normalizeNickname(profile.nickname)
    const cleanValue = cleanMessage(args.message, 240)
    const messages = { ...(countdown.messages ?? {}) }

    if (cleanValue === undefined) {
      delete messages[key]
    } else {
      messages[key] = cleanValue
    }

    await ctx.db.patch(profile.countdownId, {
      messages,
      updatedAt: Date.now(),
    })

    return buildCountdownState(ctx, profile)
  },
})

export const syncWithProfile = mutation({
  args: {
    nickname: v.string(),
    partnerNickname: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanNicknameValue = assertNickname(args.nickname)
    const cleanPartnerNickname = assertNickname(args.partnerNickname)
    assertDifferentNicknames(cleanNicknameValue, cleanPartnerNickname)

    const partnerProfile = await getProfileByNickname(
      ctx.db,
      cleanPartnerNickname,
    )

    if (!partnerProfile?.countdownId) {
      throw new Error('Esa persona aun no tiene un countdown para sincronizar.')
    }

    const profile = await upsertProfile(
      ctx,
      cleanNicknameValue,
      cleanPartnerNickname,
    )
    const now = Date.now()
    const countdownId = partnerProfile.countdownId as Id<'countdowns'>

    await ctx.db.patch(profile._id, {
      partnerNickname: partnerProfile.nickname,
      countdownId,
      updatedAt: now,
    })

    const updatedProfile = (await ctx.db.get(profile._id)) as Doc<'profiles'>

    return buildCountdownState(ctx, updatedProfile)
  },
})
