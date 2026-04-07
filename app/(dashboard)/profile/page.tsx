'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, Button, Alert, LoadingSpinner } from '@/app/components';

export default function ProfilePage() {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user) {
            setFormData({ name: user.name, email: user.email });
        }
    }, [user, loading, isAuthenticated, router]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                    User Profile
                </h1>

                <Card>
                    <div className="space-y-6">
                        {/* Profile Header */}
                        <div className="flex items-center gap-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="w-24 h-24 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {user.name}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    {user.email}
                                </p>
                                <span
                                    className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium ${user.role === 'ADMIN'
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
                            </div>
                        </div>

                        {/* Profile Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                                    Full Name
                                </label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-900 dark:text-white">{user.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                                    Email
                                </label>
                                {editMode ? (
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled
                                    />
                                ) : (
                                    <p className="text-lg text-gray-900 dark:text-white">{user.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                                    Role
                                </label>
                                <p className="text-lg text-gray-900 dark:text-white">{user.role}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                                    Team
                                </label>
                                <p className="text-lg text-gray-900 dark:text-white">
                                    {user.team?.name || 'No Team Assigned'}
                                </p>
                            </div>
                        </div>

                        {/* Team Details */}
                        {user.team && (
                            <div className="bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                                    Team Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">Team Name</p>
                                        <p className="font-medium text-blue-900 dark:text-blue-100">
                                            {user.team.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">Team Code</p>
                                        <p className="font-mono text-blue-900 dark:text-blue-100">
                                            {user.team.code}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-blue-700 dark:text-blue-300">Description</p>
                                        <p className="text-blue-900 dark:text-blue-100">
                                            {user.team.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Edit Button */}
                        <div className="flex gap-4">
                            {editMode ? (
                                <>
                                    <Button>Save Changes</Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => setEditMode(false)}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <Button className='dark:text-white' onClick={() => setEditMode(true)}>
                                    Edit Profile
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
