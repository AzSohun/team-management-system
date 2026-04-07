'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { Card, Button, Alert, LoadingSpinner } from '@/app/components';
import { apiCall } from '@/app/utils/api';
import Link from 'next/link';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface TeamDetails {
    id: string;
    name: string;
    description: string;
    code: string;
    createdAt: string;
    updatedAt: string;
}

export default function TeamDetailsPage() {
    const [team, setTeam] = useState<TeamDetails | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const teamId = params.teamId as string;

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!authLoading) {
            fetchTeamDetails();
        }
    }, [authLoading, isAuthenticated, router, teamId]);

    const fetchTeamDetails = async () => {
        try {
            setLoading(true);
            const data = await apiCall(`/api/team/${teamId}`, {
                method: 'GET',
            });
            setTeam(data.team);
            setMembers(data.members || []);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to fetch team details'
            );
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return <LoadingSpinner message="Loading team details..." />;
    }

    if (!isAuthenticated) {
        return null;
    }

    if (!team) {
        return (
            <div className="flex-1 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Alert type="error" message="Team not found" />
                    <Link href="/teams">
                        <Button className="mt-4">Go Back to Teams</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Link
                            href="/teams"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block"
                        >
                            ← Back to Teams
                        </Link>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            {team.name}
                        </h1>
                    </div>
                    <Button variant="secondary">Edit Team</Button>
                </div>

                {error && <Alert type="error" message={error} />}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Team Information */}
                    <Card className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Team Information
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </p>
                                <p className="text-gray-900 dark:text-white">
                                    {team.description || 'No description provided'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Team Code
                                </p>
                                <div className="flex items-center gap-2">
                                    <code className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-gray-900 dark:text-white font-mono">
                                        {team.code}
                                    </code>
                                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                        📋
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Created
                                    </p>
                                    <p className="text-gray-900 dark:text-white">
                                        {new Date(team.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Last Updated
                                    </p>
                                    <p className="text-gray-900 dark:text-white">
                                        {new Date(team.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Stats */}
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Statistics
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">Total Members</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    {members.length}
                                </p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                                <p className="text-sm text-gray-700 dark:text-gray-300">Team Status</p>
                                <p className="font-semibold text-green-600 dark:text-green-400">Active</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Team Members */}
                <Card>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Team Members
                    </h2>

                    {members.length === 0 ? (
                        <p className="text-gray-700 dark:text-gray-300 text-center py-8">
                            No members in this team yet
                        </p>
                    ) : (
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
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((member) => (
                                        <tr
                                            key={member.id}
                                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                                                {member.name}
                                            </td>
                                            <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                                                {member.email}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
