'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: string[];
}

export const ProtectedRoute = ({
    children,
    requiredRole,
}: ProtectedRouteProps) => {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (
            !loading &&
            requiredRole &&
            user &&
            !requiredRole.includes(user.role)
        ) {
            router.push('/dashboard');
        }
    }, [loading, isAuthenticated, user, requiredRole, router]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return null;
    }

    if (
        requiredRole &&
        user &&
        !requiredRole.includes(user.role)
    ) {
        return null;
    }

    return <>{children}</>;
};
