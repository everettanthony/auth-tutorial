import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import { FaLock } from 'react-icons/fa';

const font = Poppins({
    subsets: ['latin'],
    weight: ['600']
});

interface HeaderProps {
    label: string;
}

export const Header = ({
    label
}: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-2 items-center justify-center">
            <h1 className={cn(
                "text-3xl font-semibold flex",
                font.className
            )}>
                <FaLock className="mr-2 text-emerald-300 text-md" />NextAuth
            </h1>
            <p className="text-muted-foreground text-md">
                {label}
            </p>
        </div>
    )
}