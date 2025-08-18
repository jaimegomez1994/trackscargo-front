import { IconButton } from './IconButton';

interface EditButtonProps {
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function EditButton({ onClick, disabled = false, size = 'md', className }: EditButtonProps) {
  return (
    <IconButton
      variant="edit"
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      <svg className="-ml-0.5 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      Edit
    </IconButton>
  );
}

export default EditButton;