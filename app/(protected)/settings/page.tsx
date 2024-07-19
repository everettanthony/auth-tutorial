import { auth, signOut } from '@/auth';

const SettingsPage = async () => {
    const session = await auth();

    return (
        <div>
            Protected Settings Page
            <div className="mt-5">
                {JSON.stringify(session)}
            </div>
            <form action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
            }} className="mt-3">
                <button type="submit">Sign Out</button>
            </form>
        </div>
    )
}

export default SettingsPage;