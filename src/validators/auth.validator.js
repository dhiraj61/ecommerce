const { z } = require("zod");

const loginValidator = z.object({
  email: z.email("Invalid Email").transform((s) => s.trim()),
  password: z
    .string()
    .min(8, "at least 8 character required")
    .refine((p) => /(?=.*[A-Z])/.test(p), {
      message: "Password must contain an uppercase letter",
    })
    .refine((p) => /(?=.*\d)/.test(p), {
      message: "Password must contain a number",
    })
    .refine((p) => /(?=.*@)/.test(p), { message: "Password must contain @" }),
});

module.exports = { loginValidator };
