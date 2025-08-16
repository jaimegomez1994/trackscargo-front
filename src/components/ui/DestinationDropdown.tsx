import { Dropdown, type DropdownOption } from './primitives/Dropdown';
import { commonLocations } from '../../lib/validation';

interface DestinationDropdownProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export function DestinationDropdown({ value, onChange, error, className }: DestinationDropdownProps) {
  // Convert locations to dropdown options
  const locationOptions: DropdownOption[] = commonLocations.map(location => ({
    value: location,
    label: location
  }));

  // Custom filter function that requires 2+ characters on mobile
  const locationFilter = (options: DropdownOption[], filter: string) => {
    if (filter.length < 2) return [];
    return options.filter(option =>
      option.label.toLowerCase().includes(filter.toLowerCase())
    );
  };

  return (
    <Dropdown
      value={value}
      onChange={onChange}
      options={locationOptions}
      placeholder="Los Angeles, CA"
      error={error}
      allowCustomInput={true}
      filterFunction={locationFilter}
      maxOptions={10}
      className={className}
    />
  );
}

export default DestinationDropdown;