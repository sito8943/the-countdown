import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  profiles: defineTable({
    nickname: v.string(),
    normalizedNickname: v.string(),
    partnerNickname: v.optional(v.string()),
    countdownId: v.optional(v.id('countdowns')),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_normalized_nickname', ['normalizedNickname']),
  countdowns: defineTable({
    initialDays: v.number(),
    placedAt: v.number(),
    ownerNickname: v.string(),
    eyebrow: v.optional(v.string()),
    title: v.optional(v.string()),
    // Legacy shared note. Kept optional so old docs still validate.
    note: v.optional(v.string()),
    // Directional messages keyed by the sender's normalized nickname.
    // The partner reads the entry stored under the sender's key.
    messages: v.optional(v.record(v.string(), v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
})
