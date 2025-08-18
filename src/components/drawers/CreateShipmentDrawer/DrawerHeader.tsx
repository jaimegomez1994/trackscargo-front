interface DrawerHeaderProps {
  onClose: () => void;
}

function DrawerHeader({ onClose }: DrawerHeaderProps) {
  return (
    <div className="bg-white px-4 py-6 sm:px-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h2 className="text-lg font-medium leading-6 text-gray-900">
            Create New Shipment
          </h2>
        </div>
        <div className="ml-3 flex h-7 items-center">
          <button
            type="button"
            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={onClose}
          >
            <span className="absolute -inset-2.5" />
            <span className="sr-only">Close panel</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DrawerHeader;