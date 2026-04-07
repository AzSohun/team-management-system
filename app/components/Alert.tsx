interface AlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

export const Alert = ({
    type = 'info',
    message,
}: AlertProps) => {
    const colors = {
        success: 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 border border-green-300 dark:border-green-700',
        error: 'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 border border-red-300 dark:border-red-700',
        warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 border border-yellow-300 dark:border-yellow-700',
        info: 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border border-blue-300 dark:border-blue-700',
    };

    return (
        <div className={`p-4 border rounded-lg ${colors[type]}`}>
            {message}
        </div>
    );
};
