'use client';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCurrentUser } from '@/hooks/user-current-user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { settings } from '@/actions/settings';
import { SettingsSchema } from '@/schemas';
import { UserRole } from '@prisma/client';
import {
    Card,
    CardHeader,
    CardContent
} from '@/components/ui/card';
import {
    Form,
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GearIcon, ReloadIcon } from '@radix-ui/react-icons';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const SettingsPage = () => {
    const user = useCurrentUser();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const { update } = useSession();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name || undefined,
            email: user?.email || undefined,
            password: undefined,
            newPassword: undefined,
            role: user?.role || undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
        }
    });

    const clickHandler = (values: z.infer<typeof SettingsSchema>) => {
        startTransition(() => {
            settings(values)
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                }

                if (data.success) {
                    update();
                    setSuccess(data.success);
                }
            })
            .catch(() => setError('Error updating user.'));
        });
    };

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="flex items-center justify-center 
                    text-2xl font-semibold text-center">
                    <GearIcon width="21" height="21" className="mr-1" />Settings
                </p>
            </CardHeader>
            <CardContent>
                {!user ? (
                    <div>Loading...</div>
                ) : (
                    <Form {...form}>
                        <form 
                            className="space-y-6" 
                            onSubmit={form.handleSubmit(clickHandler)}>
                            <div className="space-y-4" >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field}  
                                                    placeholder="Enter name"
                                                    disabled={isPending} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {user?.isOAuth === false && (
                                    <>
                                        <FormField 
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            {...field}
                                                            placeholder="email@user.com"
                                                            type="email"
                                                            disabled={isPending}
                                                            autoComplete="off"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} 
                                        />
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            {...field}  
                                                            placeholder="Enter password"
                                                            type="password"
                                                            disabled={isPending} 
                                                            autoComplete="off"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>New Password</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            {...field}  
                                                            placeholder="Enter new password"
                                                            type="password"
                                                            disabled={isPending} 
                                                            autocomplete="off"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <Select 
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isPending}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select user role" />
                                                    </SelectTrigger>
                                                </FormControl>   
                                                <SelectContent>
                                                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                                                    <SelectItem value={UserRole.USER}>User</SelectItem>
                                                </SelectContent>     
                                            </Select>        
                                            <FormMessage />     
                                        </FormItem>
                                    )}
                                />
                                {user?.isOAuth === false && (
                                    <FormField
                                        control={form.control}
                                        name="isTwoFactorEnabled"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center
                                                justify-between rounded-lg border p-3 shadow-sm">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Two Factor Authentication</FormLabel>
                                                    <FormDescription>
                                                        Enable two factor authentication for your account.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch 
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        disabled={isPending}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                            <FormError message={error} />
                            <FormSuccess message={success} />
                            <div className="flex justify-end border-t border-t-input border-solid pt-3">
                                <Button disabled={isPending} type="submit">
                                    {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />} Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </CardContent>
        </Card>
    )
}

export default SettingsPage;