'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { ResetSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { reset } from '@/actions/reset';
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { ReloadIcon } from '@radix-ui/react-icons';

export const ResetForm = () => {
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: ''
        }
    });

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        setError('');

        startTransition(() => {
            reset(values)
                .then((data) => {
                    setError(data?.error);
                    setSuccess(data?.success);
                });
        });
    }

    return  (
        <CardWrapper
            headerLabel="Reset Password"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6">
                    <div className="space-y-4">
                        <FormField 
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            type="email"
                                            placeholder="email@user.com"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} 
                        />
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}>
                        {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />} Send reset email
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}