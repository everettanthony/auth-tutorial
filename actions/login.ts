'use server';
import * as z from 'zod';
import { LoginSchema } from '@/schemas';

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    if (!validatedFields.success) {
        return { error: 'Login failed.' }; 
    }

    return { success: 'Login successful!' };
}