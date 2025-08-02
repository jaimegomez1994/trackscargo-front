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
            Creating...
          </>
        ) : (
          <>
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Create Shipment
          </>
        )}
      </button>
    </div>
  );
}

export default DrawerFooter;