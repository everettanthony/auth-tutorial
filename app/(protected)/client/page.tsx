'use client';
import { SessionProvider } from 'next-auth/react';
import { useCurrentUser } from '@/hooks/user-current-user';
import { UserInfo } from '@/components/user-info';

const ClientPage = () => {
    const user = useCurrentUser();

    return (
        <UserInfo label="Client Component" user={user} />
    );
};

export default ClientPage;