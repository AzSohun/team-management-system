export const apiCall = async (
    url: string,
    options: RequestInit = {}
) => {
    const defaultOptions: RequestInit = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(url, {
        ...defaultOptions,
        ...options,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
    }

    return data;
};

export const getUsers = () =>
    apiCall('/api/user', { method: 'GET' });

export const getUserById = (userId: string) =>
    apiCall(`/api/user/${userId}`, { method: 'GET' });

export const updateUserRole = (userId: string, role: string) =>
    apiCall(`/api/user/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
    });
