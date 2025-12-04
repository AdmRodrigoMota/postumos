import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { storagePut } from "./storage";

export const uploadRouter = router({
  photo: protectedProcedure
    .input(z.object({
      fileKey: z.string(),
      buffer: z.array(z.number()),
      contentType: z.string(),
    }))
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.buffer);
      const { url } = await storagePut(input.fileKey, buffer, input.contentType);
      return { url, key: input.fileKey };
    }),
});
