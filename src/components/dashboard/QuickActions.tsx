import { Link } from 'react-router-dom';

interface QuickActionsProps {
  onCreateShipment: () => void;
}

function QuickActions({ onCreateShipment }: QuickActionsProps) {
  const actions = [
    {
      title: 'Create New Shipment',
      description: 'Add a new shipment to track',
      icon: (
        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      onClick: onCreateShipment,
      color: 'border-primary text-primary hover:border-primary-dark',
    },
    {
      title: 'Track Shipment',
      description: 'Look up shipment status',
      icon: (
        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      href: '/',
      color: 'border-blue-300 text-blue-600 hover:border-blue-400',
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Quick Actions
        </h3>
        <div className="mt-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {actions.map((action) => {
              if (action.onClick) {
                return (
                  <button
                    key={action.title}
                    onClick={action.onClick}
                    className={`relative block w-full border-2 border-dashed rounded-lg p-6 text-center hover:border-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${action.color}`}
                  >
                    <div className="mx-auto">
                      {action.icon}
                    </div>
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      {action.title}
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      {action.description}
                    </span>
                  </button>
                );
              }
              
              return (
                <Link
                  key={action.title}
                  to={action.href}
                  className={`relative block w-full border-2 border-dashed rounded-lg p-6 text-center hover:border-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${action.color}`}
                >
                  <div className="mx-auto">
                    {action.icon}
                  </div>
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    {action.title}
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    {action.description}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickActions;