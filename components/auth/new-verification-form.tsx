'use client';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { newVerification } from '@/actions/new-verification';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { BeatLoader } from 'react-spinners';

export const NewVerificationForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError('The token is missing.');
            return;
        }

        newVerification(token)
            .then((data) => {
                setError(data.error);
                setSuccess(data.success);
            })
            .catch(() => {
                setError('Something went wrong with this token.');
            });
    }, [token,success, error]);

    useEffect(() => {
        onSubmit();
    },[onSubmit])

    return (
        <CardWrapper
            headerLabel="Email Verification"
            backButtonLabel="Return to login"
            backButtonHref="/auth/login">
            <div className="flex flex-col items-center justify-center w-full">
                {!success && !error && (
                    <BeatLoader />
                )}
                <FormSuccess message={success} />
                {!success && (
                    <FormError message={error} />
                )}
            </div>
        </CardWrapper>
    )
}