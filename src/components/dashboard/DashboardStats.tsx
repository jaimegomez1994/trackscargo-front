import type { Shipment } from '../../types/api';

interface DashboardStatsProps {
  shipments: Shipment[];
  isLoading: boolean;
}

function DashboardStats({ shipments, isLoading }: DashboardStatsProps) {
  // Calculate stats
  const totalShipments = shipments.length;
  const inTransitShipments = shipments.filter(s => 
    s.status.toLowerCase().includes('transit') || 
    s.status.toLowerCase().includes('picked') ||
    s.status.toLowerCase() === 'shipped'
  ).length;
  const deliveredShipments = shipments.filter(s => 
    s.status.toLowerCase().includes('delivered')
  ).length;
  
  // This month shipments (basic approximation)
  const thisMonth = new Date();
  thisMonth.setDate(1);
  const thisMonthShipments = shipments.filter(s => {
    // Since we don't have createdAt in response, we'll use travel history
    if (s.travelHistory.length > 0) {
      const firstEvent = new Date(s.travelHistory[s.travelHistory.length - 1].timestamp);
      return firstEvent >= thisMonth;
    }
    return false;
  }).length;

  const stats = [
    {
      name: 'Total Shipments',
      value: totalShipments,
      icon: (
        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      bgColor: 'bg-white',
    },
    {
      name: 'In Transit',
      value: inTransitShipments,
      icon: (
        <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      bgColor: 'bg-white',
    },
    {
      name: 'Delivered',
      value: deliveredShipments,
      icon: (
        <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-white',
    },
    {
      name: 'This Month',
      value: thisMonthShipments,
      icon: (
        <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: 'bg-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className={`${stat.bgColor} overflow-hidden shadow rounded-lg`}>
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {isLoading ? (
                      <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                      </div>
                    ) : (
                      stat.value
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardStats;