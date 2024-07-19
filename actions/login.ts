'use server';
import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { generateVerificationToken } from '@/lib/tokens';
import { getUserByEmail } from '@/data/user';
import { sendVerificationEmail } from '@/lib/mail';

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    if (!validatedFields.success) {
        return { error: 'Login failed.' }; 
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: 'The credentials you entered are invalid.' };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(
            verificationToken.email, 
            verificationToken.token
        );
        
        return { success: 'The confirmation email was sent.' };
    }

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