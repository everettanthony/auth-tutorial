import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import NavBar from '@/app/(protected)/_components/navbar';

interface ProtectedLayoutProps {
    children: React.ReactNode
};

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
    const session = await auth();

    return (
        <SessionProvider session={session}>
            <div className="flex h-full flex-col items-center justify-center 
                bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
                from-sky-400 to-blue-800">
                <NavBar />
                {children}
            </div>
        </SessionProvider>
    );
}

export default ProtectedLayout;