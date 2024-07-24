'use client';
import { useCurrentUser } from '@/hooks/user-current-user';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
    Avatar,
    AvatarImage,
    AvatarFallback
} from '@/components/ui/avatar';
import { LogoutButton } from '@/components/auth/logout-button';
import { FaUser } from 'react-icons/fa';
import { ExitIcon } from '@radix-ui/react-icons';

export const UserButton = () => {
    const user = useCurrentUser();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
                <Avatar>
                    <AvatarImage src={user?.image!} alt={user?.name!} />
                    <AvatarFallback className="bg-sky-500">
                        <FaUser className="text-white" />
                    </AvatarFallback> 
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
                <LogoutButton>
                    <DropdownMenuItem>
                        <ExitIcon className="h-4 w-4 mr-2" /> 
                        Sign Out
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};