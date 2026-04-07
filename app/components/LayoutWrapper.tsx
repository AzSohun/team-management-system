'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Navbar } from './Navbar';

export const LayoutWrapper = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {isAuthenticated && <Navbar />}
            {children}
        </>
    );
};
