import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-4">
    <div className="bg-red-100 rounded-full p-4">
      <AlertCircle size={32} className="text-red-600" />
    </div>
    <div>
      <p className="text-lg font-semibold text-gray-800">Oops! An error occurred</p>
      <p className="text-gray-500 mt-1">{message}</p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="btn-secondary mt-2"
        id="retry-btn"
      >
        <RefreshCw size={18} />
        Try Again
      </button>
    )}
  </div>
);

export default ErrorMessage;
