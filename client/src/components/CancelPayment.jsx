import { XCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CancelPayment() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-red-100">
        <XCircleIcon className="text-red-600 w-24 h-24" />
        <h1 className="text-3xl font-bold text-red-700 mt-4">Payment Failed!</h1>
        <p className="text-lg text-red-800 mt-2">Something went wrong. Please try again.</p>
        <Link to="/" className="mt-6 px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800">
        Go to Homepage
        </Link>
    </div>
  )
}
