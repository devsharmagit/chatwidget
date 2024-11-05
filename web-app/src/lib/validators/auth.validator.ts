import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase(),
  password: z.string().min(8, "please enter vaild password"),
});

export const signupSchema = z
.object({
    email: z.string().email("Invalid email").toLowerCase(),
    password: z.string().min(8, "please enter vaild password"),
    confirmPassword: z.string(),
})
.refine(
    (values) => {
        return values.password === values.confirmPassword;
    },
    { message: "password dont match", path: ["confirmPassword"] }
);

export type SignupType = z.infer<typeof signupSchema>;
export type LoginType = z.infer<typeof loginSchema>;
