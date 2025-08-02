import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateTravelEventFormData } from '../../../lib/validation';
import type { Shipment } from '../../../types/api';
import EventForm from './EventForm';
import TravelHistory from './TravelHistory';

interface TabbedContentProps {
  form: UseFormReturn<CreateTravelEventFormData>;
  shipment: Shipment;
  error?: any;
}

function TabbedContent({ form, shipment, error }: TabbedContentProps) {
  const [activeTab, setActiveTab] = useState<'add-status' | 'travel-history'>('add-status');

  const tabs = [
    { 
      id: 'add-status', 
      name: 'Add Status', 
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    { 
      id: 'travel-history', 
      name: 'Travel History', 
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-4 sm:px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as 'add-status' | 'travel-history')}
              className={`${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-6 sm:px-6">
        {activeTab === 'add-status' && (
          <div>
            <EventForm form={form} />
            {error && (
              <div className="mt-6">
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error adding tracking event
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        {error?.message || 'An unexpected error occurred'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'travel-history' && (
          <TravelHistory shipment={shipment} />
        )}
      </div>
    </div>
  );
}

export default TabbedContent;