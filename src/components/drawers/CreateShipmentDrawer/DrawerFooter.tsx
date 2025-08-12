import { Button } from '../../ui';

interface DrawerFooterProps {
  isSubmitting: boolean;
}

function DrawerFooter({ isSubmitting }: DrawerFooterProps) {
  return (
    <div className="flex-shrink-0 border-t border-gray-200 px-4 py-4 sm:px-6">
      <Button
        type="submit"
        disabled={isSubmitting}
        loading={isSubmitting}
        variant="blue"
        size="lg"
        fullWidth
        leftIcon={
          !isSubmitting ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ) : undefined
        }
      >
        Create Shipment
      </Button>
    </div>
  );
}

export default DrawerFooter;