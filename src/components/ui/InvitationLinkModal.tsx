import { Card } from './primitives/Card';
import { Button } from './primitives/Button';

interface InvitationLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitationLink: string;
  email: string;
  title?: string;
  successMessage?: string;
}

export function InvitationLinkModal({ 
  isOpen, 
  onClose, 
  invitationLink, 
  email,
  title = "Invitation Link",
  successMessage = "Invitation created successfully!"
}: InvitationLinkModalProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationLink);
    // You could add a toast notification here
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium mb-2">
              {successMessage}
            </p>
            <p className="text-sm text-green-700">
              Share this link with {email} to join your organization:
            </p>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={invitationLink}
              readOnly
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
            />
            <Button onClick={handleCopyLink} size="sm">
              Copy
            </Button>
          </div>
          
          <Button onClick={onClose} variant="secondary" className="w-full">
            Done
          </Button>
        </div>
      </Card>
    </div>
  );
}