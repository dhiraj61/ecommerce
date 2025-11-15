const { z } = require("zod");

const userValidator = z.object({
  name: z
    .string()
    .min(2, "minimum 2 letters required")
    .transform((s) => s.trim()),
  email: z.email("invalid email").transform((s) => s.trim()),
  password: z
    .string()
    .min(8, "Password at least 8 chars")
    .refine((p) => /(?=.*[A-Z])/.test(p), {
      message: "Password must contain an uppercase letter",
    })
    .refine((p) => /(?=.*\d)/.test(p), {
      message: "Password must contain a number",
    })
    .refine((p) => /(?=.*@)/.test(p), {
      message: "Password must contain @",
    }),
});

module.exports = { userValidator };
