interface ErrorDisplayProps {
  error: Error | null;
}

function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Error creating shipment
          </h3>
          <div className="mt-2 text-sm text-red-700">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorDisplay;