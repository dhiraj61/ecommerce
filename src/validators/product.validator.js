const { z } = require("zod");

const productValidatorSchema = z.object({
  imageUrl: z.string().transform((p) => p.trim()),
  title: z
    .string()
    .min(10, "atleast 10 characters required")
    .max(100, "maximum 100 characters")
    .transform((p) => p.trim()),
  category: z
    .string()
    .min(5, "atleast 5 characters required")
    .max(25, "maximum 25 characters")
    .transform((p) => p.trim()),
  description: z
    .string()
    .min(100, "atleast 100 characters required")
    .transform((p) => p.trim()),
  price: z.object({
    amount: z.number().positive("Amount must be a positive number"),
    currency: z.enum(["INR", "USD"]).default("INR"),
  }),
  stock: z
    .number()
    .positive("Stock must be a positive number")
    .lt(1001, "maximum 1000 allowed"),
});

module.exports = { productValidatorSchema };
