'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { Card, Button, Alert, LoadingSpinner, Input } from '@/app/components';
import { apiCall } from '@/app/utils/api';
import Link from 'next/link';

interface UserDetail {
    id: string;
    name: string;
    email: string;
    role: string;
    teamId: string | null;
    team: { name: string } | null;
    createdAt: string;
    updatedAt: string;
}

const ROLES = ['ADMIN', 'LEADER', 'GUIDE', 'DEVELOPER'];

export default function UserDetailsPage() {
    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ role: '' });
    const { isAuthenticated, loading: authLoading, user: currentUser } = useAuth();
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!authLoading && currentUser?.role !== 'ADMIN') {
            router.push('/dashboard');
            return;
        }

        if (!authLoading) {
            fetchUserDetails();
        }
    }, [authLoading, isAuthenticated, currentUser, router, userId]);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const data = await apiCall(`/api/user/${userId}`, {
                method: 'GET',
            });
            setUser(data.user);
            setFormData({ role: data.user.role });
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to fetch user details'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async () => {
        try {
            setError('');
            await apiCall(`/api/user/${userId}/role`, {
                method: 'PUT',
                body: JSON.stringify({ role: formData.role }),
            });
            if (user) {
                setUser({ ...user, role: formData.role });
            }
            setEditMode(false);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to update user role'
            );
        }
    };

    if (authLoading || loading) {
        return <LoadingSpinner message="Loading user details..." />;
    }

    if (!isAuthenticated || currentUser?.role !== 'ADMIN') {
        return null;
    }

    if (!user) {
        return (
            <div className="flex-1 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Alert type="error" message="User not found" />
                    <Link href="/users">
                        <Button className="mt-4">Go Back to Users</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <Link
                        href="/users"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block"
                    >
                        ← Back to Users
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                        {user.name}
                    </h1>
                </div>

                {error && <Alert type="error" message={error} />}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Information */}
                    <Card className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            User Information
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                                    Full Name
                                </p>
                                <p className="text-lg text-gray-900 dark:text-white">{user.name}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                                    Email
                                </p>
                                <p className="text-lg text-gray-900 dark:text-white">{user.email}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                                    Current Role
                                </p>
                                <p className="text-lg">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${user.role === 'ADMIN'
                                            ? 'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100'
                                            : user.role === 'LEADER'
                                                ? 'bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100'
                                                : user.role === 'GUIDE'
                                                    ? 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100'
                                                    : 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                                            }`}
                                    >
                                        {user.role}
                                    </span>
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">
                                    Team
                                </p>
                                <p className="text-lg text-gray-900 dark:text-white">
                                    {user.team?.name || 'No Team Assigned'}
                                </p>
                            </div>
                        </div>

                        {/* Edit Role Section */}
                        {editMode ? (
                            <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
                                    Change User Role
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                                            New Role
                                        </label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) =>
                                                setFormData({ role: e.target.value })
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {ROLES.map((role) => (
                                                <option key={role} value={role}>
                                                    {role}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button onClick={handleUpdateRole}>
                                            Update Role
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => setEditMode(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8">
                                <Button
                                    onClick={() => setEditMode(true)}
                                    variant="secondary"
                                >
                                    Change Role
                                </Button>
                            </div>
                        )}
                    </Card>

                    {/* Statistics */}
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Activity
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-400">User ID</p>
                                <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                                    {user.id}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-400">Member Since</p>
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-400">Last Updated</p>
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {new Date(user.updatedAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                                <p className="font-semibold text-green-600 dark:text-green-400">Active</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
