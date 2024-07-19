import { Header } from '@/components/auth/header';
import { BackButton } from '@/components/auth/back-button';
import { CardWrapper } from '@/components/auth/card-wrapper';

export const ErrorCard = () => {
    return  (
        <CardWrapper
            headerLabel="Opps! Something went wrong!"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login">
            <div className="flex items-center justify-center">
                Click the link below to try again.
            </div>
        </CardWrapper>
    )
}