'use server';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { RegisterSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    await new Promise((resolve) => setTimeout(resolve, 3000));

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

    // TODO: Send verification token email to user

    return { success: 'Welcome aboard! Registration successful!' };
}