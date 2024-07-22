'use server';
import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import { db } from '@/lib/db';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { generateVerificationToken, generateTwoFactorToken } from '@/lib/tokens';
import { getUserByEmail } from '@/data/user';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/mail';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    if (!validatedFields.success) {
        return { error: 'Login failed.' }; 
    }

    const { email, password, code } = validatedFields.data;

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

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

            if (!twoFactorToken) {
                return { error: 'Invalide 2FA Code.' };
            }

            if (twoFactorToken.token !== code) {
                return { error: 'Invalide 2FA Code.' };
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if (hasExpired) {
                return { error: 'The 2FA code has expired.' };
            }

            await db.twoFactorToken.delete({
                where: { id: twoFactorToken.id }
            });

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

            if (existingConfirmation) {
                await db.twoFactorToken.delete({
                    where: { id: existingConfirmation.id }
                });
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            });
        }
        else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);

            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token
            );
    
            return { twoFactor: true };
        }
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