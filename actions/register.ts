'use server';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { RegisterSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

   // await new Promise((resolve) => setTimeout(resolve, 3000));

    if (!validatedFields.success) {
        return { error: 'Registration failed.' }; 
    }

    const { name, email, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: `We're sorry, this email is already taken. Please try again.` };
    }

    await db.user.create({
        data: {
            name, 
            email,
            password: hashedPassword
        }
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
        verificationToken.email, 
        verificationToken.token
    );

    return { success: 'Welcome aboard! A confirmation email was just sent to you.' };
}