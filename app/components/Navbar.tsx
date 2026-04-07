'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useTheme } from '@/app/context/ThemeContext';
import { Button } from './Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <nav className="bg-gray-50 dark:bg-gray-800 shadow-md dark:shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/dashboard" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        TeamHub
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/dashboard" className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link>
                        <Link href="/teams" className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Teams</Link>
                        <Link href="/users" className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Users</Link>
                        <Link href="/profile" className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Profile</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user?.name}</span>
                            <span className="text-xs bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-2 py-1 rounded">{user?.role}</span>
                        </div>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-yellow-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>

                        <div className="relative">
                            <button onClick={() => setShowMenu(!showMenu)} className="md:hidden p-2 text-gray-800 dark:text-gray-200">☰</button>
                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                                    <Link href="/dashboard" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</Link>
                                    <Link href="/teams" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Teams</Link>
                                    <Link href="/users" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Users</Link>
                                    <Link href="/profile" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                                    <div className="border-t border-gray-200 dark:border-gray-700" />
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-700 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                                </div>
                            )}
                        </div>

                        <Button variant="danger" size="sm" onClick={handleLogout} className="hidden sm:block dark:text-white">Logout</Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
