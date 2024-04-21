import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createWorkorder = mutation({
    args: {
        mechanicName: v.string(),
        orgId: v.string(),
        workOrderNumber: v.string(),
        // vehicle: v.object({
        //     make: v.string(),
        //     model: v.string(),
        //     year: v.string(),
        //     vin: v.string()
        // }),
        parts: v.array(
            v.object({
                partName: v.string(),
                partNumber: v.string()
            })
        ),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert('workorders', {
            mechanicName: args.mechanicName,
            orgId: args.orgId,
            workOrderNumber: args.workOrderNumber,
            parts: args.parts
        })
    }
})