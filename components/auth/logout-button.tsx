'use client';
import { logout } from '@/actions/logout';

interface LogoutButtonProps {
    children?: React.ReactNode
};

export const LogoutButton = ({
    children
}: LogoutButtonProps) => {
    const clickHandler = () => {
        logout();
    }

    return (
        <span onClick={clickHandler} className="cursor-pointer">
            {children}
        </span>
    )
}