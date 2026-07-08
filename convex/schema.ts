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
    note: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
})
