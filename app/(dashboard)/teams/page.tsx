'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, Button, Alert, Input } from '@/app/components';
import { apiCall } from '@/app/utils/api';

interface TeamType {
    id: string;
    name: string;
    description: string;
    code: string;
    createdAt: string;
    updatedAt: string;
}

export default function TeamsPage() {
    const [teams, setTeams] = useState<TeamType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!authLoading) {
            fetchTeams();
        }
    }, [authLoading, isAuthenticated, router]);

    const fetchTeams = async () => {
        try {
            setLoading(true);
            const data = await apiCall('/api/team', { method: 'GET' });
            setTeams(data.teams || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch teams');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError('Team name is required');
            return;
        }

        try {
            setSubmitLoading(true);
            setError('');
            const newTeam = await apiCall('/api/team', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            setTeams([...teams, newTeam.team]);
            setFormData({ name: '', description: '' });
            setShowForm(false);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to create team'
            );
        } finally {
            setSubmitLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-700 dark:text-gray-400">Loading teams...</p>
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
                            Teams Management
                        </h1>
                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                            Manage all teams in the system
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowForm(!showForm)}
                        variant={showForm ? 'secondary' : 'primary'}
                    >
                        {showForm ? 'Cancel' : '+ New Team'}
                    </Button>
                </div>

                {error && (
                    <Alert type="error" message={error} />
                )}

                {showForm && (
                    <Card className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            Create New Team
                        </h2>
                        <form onSubmit={handleCreateTeam} className="space-y-4">
                            <Input
                                label="Team Name"
                                type="text"
                                placeholder="Enter team name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                required
                            />

                            <Input
                                label="Description"
                                type="text"
                                placeholder="Enter team description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            />

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? 'Creating...' : 'Create Team'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-700 dark:text-gray-300 text-lg">No teams found</p>
                            <Button
                                onClick={() => setShowForm(true)}
                                className="mt-4"
                            >
                                Create Your First Team
                            </Button>
                        </div>
                    ) : (
                        teams.map((team) => (
                            <Card key={team.id}>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {team.name}
                                        </h3>
                                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                                            {team.description}
                                        </p>
                                    </div>

                                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                                            Team Code:
                                        </p>
                                        <p className="text-mono font-semibold text-gray-900 dark:text-white break-all">
                                            {team.code}
                                        </p>
                                    </div>

                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        Created:{' '}
                                        {new Date(team.createdAt).toLocaleDateString()}
                                    </div>

                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
                    <p>
                        Total Teams: <span className="font-bold text-gray-900 dark:text-white">{teams.length}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
