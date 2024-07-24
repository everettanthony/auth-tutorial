'use server';
import { signOut } from '@/auth';

export const logout = async () => {
    
    // perform some server actions before running signOut()

    await signOut({
        redirectTo: '/auth/login'
    });
}