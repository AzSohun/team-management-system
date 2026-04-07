interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = ({
    label,
    error,
    className = '',
    ...props
}: InputProps) => {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    {label}
                </label>
            )}
            <input
                className={`px-4 py-2 border rounded-lg transition-all
          bg-gray-50 dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          placeholder-gray-500 dark:placeholder-gray-400
          border-gray-300 dark:border-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
          focus:border-transparent
          disabled:bg-gray-200 dark:disabled:bg-gray-700
          disabled:text-gray-500 dark:disabled:text-gray-400
          ${error
                        ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-400'
                        : 'border-gray-300 dark:border-gray-600'
                    } ${className}`}
                {...props}
            />
            {error && (
                <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
            )}
        </div>
    );
};
