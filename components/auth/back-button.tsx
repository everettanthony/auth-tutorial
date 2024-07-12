'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
    href: string;
    label: string;
}

export const BackButton = ({
    href,
    label
}: BackButtonProps) => {
    const clickHandler = () => {
        console.log('clicked')
    };

    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                size="sm"
                className="font-normal w-full"
                variant="link"
                onClick={clickHandler}
                asChild>
                <Link
                    href={href}>
                    {label}
                </Link>
            </Button>
        </div>
    )
}