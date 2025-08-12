import { Button } from '../../ui';

interface DrawerFooterProps {
  isSubmitting: boolean;
  isUploadingFiles?: boolean;
  selectedFilesCount?: number;
}

function DrawerFooter({ isSubmitting, isUploadingFiles, selectedFilesCount }: DrawerFooterProps) {
  return (
    <div className="flex-shrink-0 border-t border-gray-200 px-4 py-4 sm:px-6">
      <Button
        type="submit"
        disabled={isSubmitting || isUploadingFiles}
        loading={isSubmitting || isUploadingFiles}
        variant="blue"
        size="lg"
        fullWidth
        leftIcon={
          !isSubmitting && !isUploadingFiles ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : undefined
        }
        rightIcon={
          !isSubmitting && !isUploadingFiles && selectedFilesCount && selectedFilesCount > 0 ? (
            <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">
              {selectedFilesCount} file{selectedFilesCount > 1 ? 's' : ''}
            </span>
          ) : undefined
        }
      >
        {isSubmitting || isUploadingFiles
          ? isUploadingFiles 
            ? `Uploading Files` 
            : selectedFilesCount && selectedFilesCount > 0 
              ? `Adding Event (${selectedFilesCount} files)`
              : 'Adding Event'
          : 'Add Tracking Event'
        }
      </Button>
    </div>
  );
}

export default DrawerFooter;