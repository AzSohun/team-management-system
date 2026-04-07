import { Button } from '@/app/components';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link href="/dashboard">
                    <Button>Go Back to Dashboard</Button>
                </Link>
            </div>
        </div>
    );
}
