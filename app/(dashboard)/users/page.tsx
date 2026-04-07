'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, Button, Alert } from '@/app/components';
import { getUsers } from '@/app/utils/api';

interface UserType {
    id: string;
    name: string;
    email: string;
    role: string;
    teamId: string | null;
    team: { name: string } | null;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!authLoading) {
            fetchUsers();
        }
    }, [authLoading, isAuthenticated, router]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data.users || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-700 dark:text-gray-400">Loading users...</p>
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
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Users Management
                        </h1>
                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                            Manage all users in the system
                        </p>
                    </div>
                    <Button onClick={fetchUsers} variant="secondary">
                        🔄 Refresh
                    </Button>
                </div>

                {error && <Alert type="error" message={error} />}

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">
                                        Name
                                    </th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">
                                        Email
                                    </th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">
                                        Role
                                    </th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">
                                        Team
                                    </th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">
                                        Created At
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr key="empty">
                                        <td
                                            colSpan={5}
                                            className="text-center py-8 text-gray-700 dark:text-gray-300"
                                        >
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">
                                                {user.name}
                                            </td>
                                            <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                                                {user.email}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${user.role === 'ADMIN'
                                                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                                        : user.role === 'LEADER'
                                                            ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                                                            : user.role === 'GUIDE'
                                                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                                : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                                                {user.team?.name || '—'}
                                            </td>
                                            <td className="py-4 px-4 text-gray-700 dark:text-gray-300 text-sm">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <div className="mt-8 text-center text-gray-700 dark:text-gray-300">
                    <p>
                        Total Users: <span className="font-bold text-gray-900 dark:text-white">{users.length}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
