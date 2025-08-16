import { Dropdown, type DropdownOption } from './primitives/Dropdown';
import { trackingEventStatuses } from '../../lib/validation';

interface StatusDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  allowCustomStatus?: boolean;
}

export function StatusDropdown({
  value,
  onChange,
  placeholder = 'In Transit',
  disabled = false,
  error,
  className = '',
  allowCustomStatus = true
}: StatusDropdownProps) {
  // Convert tracking event statuses to dropdown options
  const statusOptions: DropdownOption[] = trackingEventStatuses.map(status => ({
    value: status,
    label: status
  }));

  return (
    <Dropdown
      value={value}
      onChange={onChange}
      options={statusOptions}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      allowCustomInput={allowCustomStatus}
      className={className}
      maxOptions={10} // Limit to 10 visible options for better UX
    />
  );
}

export default StatusDropdown;