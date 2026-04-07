export const LoadingSpinner = ({
  message = 'Loading...',
}: {
  message?: string;
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
};
