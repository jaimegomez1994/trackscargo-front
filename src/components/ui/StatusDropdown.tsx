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

  // Custom filter function for status - shows all options on focus
  const statusFilter = (options: DropdownOption[], filter: string) => {
    // If no filter text, show all options (on focus)
    if (filter.length === 0) return options;
    
    // Otherwise filter normally
    return options.filter(option =>
      option.label.toLowerCase().includes(filter.toLowerCase())
    );
  };

  return (
    <Dropdown
      value={value}
      onChange={onChange}
      options={statusOptions}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      allowCustomInput={allowCustomStatus}
      filterFunction={statusFilter}
      className={className}
      maxOptions={10} // Limit to 10 visible options for better UX
      openOnFocus={true} // Open immediately on focus for status selection
    />
  );
}

export default StatusDropdown;