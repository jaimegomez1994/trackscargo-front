import { IconButton } from './IconButton';

interface CopyButtonProps {
  onClick: () => void;
  copied?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CopyButton({ onClick, copied = false, disabled = false, size = 'md', className }: CopyButtonProps) {
  return (
    <IconButton
      variant="copy"
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
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
    </IconButton>
  );
}

export default CopyButton;