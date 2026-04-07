'use client';

import { useEffect } from 'react';
import { Button } from '@/app/components';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Something went wrong!
                </h2>
                <p className="text-gray-600 mb-8">{error.message}</p>
                <div className="space-x-4">
                    <Button onClick={() => reset()}>Try again</Button>
                    <Button
                        variant="secondary"
                        onClick={() => window.location.href = '/dashboard'}
                    >
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}
