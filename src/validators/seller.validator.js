const { z } = require("zod");

const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9][Z][0-9A-Z]$/;

const sellerValidator = z.object({
  name: z
    .string()
    .min(2, "at least 2 characters required")
    .transform((s) => s.trim()),
  email: z.email("Invalid Email").transform((s) => s.trim()),
  storeName: z
    .string()
    .min(2, "at least 2 characters required")
    .transform((s) => s.trim()),
  storeAddress: z
    .string()
    .min(10, "at least 10 character required")
    .max(200, "max 200 characters allowed")
    .transform((s) => s.trim()),
  phone: z
    .string()
    .transform((s) => s.trim())
    .refine((p) => /^[6-9]\d{9}$/.test(p), { message: "Invalid phone number" }),
  storeDescription: z
    .string()
    .min(5, "at least 5 charcter")
    .max(100, "maximum 100 characters")
    .optional()
    .transform((s) => (s ? s.trim() : s)),
  storeLogo: z
    .string()
    .optional()
    .transform((s) => (s ? s.trim() : s)),
  sellerGst: z
    .string()
    .optional()
    .transform((s) => (s ? s.trim().toUpperCase() : s))
    .refine((gst) => !gst || gstRegex.test(gst), { message: "Invalid Format" }),
  password: z
    .string()
    .min(8, "minimum 8 characters")
    .refine((p) => /(?=.*[A-Z])/.test(p), {
      message: "Password must contain an uppercase letter",
    })
    .refine((p) => /(?=.*\d)/.test(p), {
      message: "Password must contain a number",
    })
    .refine((p) => /(?=.*@)/.test(p), { message: "Password must contain @" }),
});

module.exports = { sellerValidator };
