import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import type { Shipment } from '../../../types/api';

interface DrawerHeaderProps {
  onClose: () => void;
  shipment: Shipment;
}

function DrawerHeader({ onClose, shipment }: DrawerHeaderProps) {
  const [copied, setCopied] = useState(false);
  const handleCopyLink = async () => {
    const trackingUrl = `${window.location.origin}/?trackid=${shipment.trackingNumber}`;
    
    try {
      await navigator.clipboard.writeText(trackingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="bg-white px-4 py-6 sm:px-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
              Add Tracking Event
            </Dialog.Title>
            <p className="text-sm text-gray-500 mt-1">
              Update status for shipment {shipment.trackingNumber}
            </p>
          </div>
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
      
      {/* Shipment Details */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">Shipment Details</h4>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {copied ? (
              <>
                <svg className="-ml-0.5 mr-1 h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="-ml-0.5 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Link
              </>
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Route:</span>
            <p className="font-medium text-gray-900 truncate">{shipment.origin} → {shipment.destination}</p>
          </div>
          <div>
            <span className="text-gray-500">Company:</span>
            <p className="font-medium text-gray-900 truncate">{shipment.company || 'N/A'}</p>
          </div>
          <div className="sm:col-span-1 col-span-2">
            <span className="text-gray-500">Details:</span>
            <p className="font-medium text-gray-900">{shipment.weight} {shipment.weightUnit || 'kg'} • {shipment.pieces} piece{shipment.pieces !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrawerHeader;