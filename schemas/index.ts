import * as z from 'zod';

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Please enter a valid email address.'
    }),
    password: z.string().min(1, {
        message: 'Please enter your password.'
    }),
    code: z.optional(z.string())
});

export const RegisterSchema = z.object({
    name: z.string().min(1, {
        message: 'Please enter your full name.'
    }),
    email: z.string().email({
        message: 'Please enter a valid email address.'
    }),
    password: z.string().min(6, {
        message: 'Minimum of 6 characters is required.'
    })
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: 'Please enter a valid email address.'
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: 'Minimum of 6 characters is required.'
    }),
});