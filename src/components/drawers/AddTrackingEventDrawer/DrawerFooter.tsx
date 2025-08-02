import LoadingSpinner from '../../LoadingSpinner';

interface DrawerFooterProps {
  isSubmitting: boolean;
}

function DrawerFooter({ isSubmitting }: DrawerFooterProps) {
  return (
    <div className="flex-shrink-0 border-t border-gray-200 px-4 py-4 sm:px-6">
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex justify-center items-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Adding Event...
          </>
        ) : (
          <>
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Add Tracking Event
          </>
        )}
      </button>
    </div>
  );
}

export default DrawerFooter;