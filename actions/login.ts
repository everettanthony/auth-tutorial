'use server';
import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    if (!validatedFields.success) {
        return { error: 'Login failed.' }; 
    }

    const { email, password } = validatedFields.data;

    try {
        await signIn('credentials', { 
            email, 
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        });
    } 
    catch (error) {
        if (error instanceof AuthError) {
            switch(error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials. Please try again.' }
                default:
                    return { error: 'Something went wrong with the login attempt. Please try again.' }
            }
        }

        throw error;
    }
}