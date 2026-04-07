'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card } from '@/app/components';
import Link from 'next/link';

export default function DashboardPage() {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-700 dark:text-gray-300">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome, {user?.name}!
                    </h1>
                    <p className="text-gray-700 dark:text-gray-300 text-lg">
                        Here's an overview of your team management system
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                    Your Role
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {user?.role}
                                </p>
                            </div>
                            <div className="text-4xl">👤</div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                    Current Team
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {user?.team?.name || 'No Team'}
                                </p>
                            </div>
                            <div className="text-4xl">🏢</div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                    Email
                                </p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 truncate">
                                    {user?.email}
                                </p>
                            </div>
                            <div className="text-4xl">📧</div>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link href="/users">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    👥 Manage Users
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    View and manage all users in the system
                                </p>
                            </Card>
                        </Link>

                        <Link href="/teams">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    🏢 Manage Teams
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    View and manage all teams in the system
                                </p>
                            </Card>
                        </Link>

                        {user?.role === 'ADMIN' && (
                            <>
                                <Card className="bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700">
                                    <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                                        ⚙️ Admin Panel
                                    </h3>
                                    <p className="text-yellow-800 dark:text-yellow-100">
                                        Access administrative controls
                                    </p>
                                </Card>

                                <Card className="bg-purple-50 border-purple-200">
                                    <h3 className="text-xl font-semibold text-purple-900 mb-2">
                                        📊 Reports
                                    </h3>
                                    <p className="text-purple-700">
                                        View system reports and analytics
                                    </p>
                                </Card>
                            </>
                        )}
                    </div>
                </div>

                {/* Team Info */}
                {user?.team && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-blue-50">
                            Team Information
                        </h2>
                        <Card>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-blue-50">
                                        Team Name
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-blue-50">
                                        {user.team.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-blue-50">
                                        Description
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-blue-50">
                                        {user.team.description}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-blue-50">
                                        Team Code
                                    </p>
                                    <p className="text-lg font-mono font-semibold text-gray-900 bg-gray-100 p-2 rounded inline-block dark:text-blue-950">
                                        {user.team.code}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
