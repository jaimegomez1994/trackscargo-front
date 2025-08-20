import { useState } from 'react';
import { useTeamMembers, useCreateInvitation, useRemoveUser, useResendInvitation, useCancelInvitation } from '../api/userApi';
import { useProfile } from '../api/authApi';
import { useAppSelector } from '../store/hooks';
import { selectAuth } from '../store/slices/authSlice';
import { Button } from '../components/ui/primitives/Button';
import { Card } from '../components/ui/primitives/Card';
import { LoadingSpinner } from '../components/ui/primitives/LoadingSpinner';
import { InvitationLinkModal } from '../components/ui/InvitationLinkModal';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function InviteUserModal({ isOpen, onClose }: InviteUserModalProps) {
  const [email, setEmail] = useState('');
  const [invitationLink, setInvitationLink] = useState('');
  const createInvitation = useCreateInvitation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await createInvitation.mutateAsync({ email });
      setInvitationLink(response.invitation.invitationLink);
      setEmail('');
    } catch (error) {
      console.error('Failed to create invitation:', error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationLink);
    // You could add a toast notification here
  };

  const handleClose = () => {
    setEmail('');
    setInvitationLink('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Invite User</h3>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

{!invitationLink ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="user@example.com"
                required
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={createInvitation.isPending}
                className="flex-1"
              >
                {createInvitation.isPending ? <LoadingSpinner size="sm" /> : 'Create Invitation'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>

            {createInvitation.error && (
              <p className="text-sm text-red-600">
                {createInvitation.error instanceof Error ? createInvitation.error.message : 'Failed to create invitation'}
              </p>
            )}
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium mb-2">
                Invitation created successfully!
              </p>
              <p className="text-sm text-green-700">
                Share this link with the user to join your organization:
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
            
            <Button onClick={handleClose} variant="secondary" className="w-full">
              Done
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

function Users() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [resendingInvitations, setResendingInvitations] = useState<Set<string>>(new Set());
  const [cancelingInvitations, setCancelingInvitations] = useState<Set<string>>(new Set());
  const [resendModalData, setResendModalData] = useState<{isOpen: boolean; email: string; invitationLink: string}>({isOpen: false, email: '', invitationLink: ''});
  const { data: teamData, isLoading, error } = useTeamMembers();
  const removeUser = useRemoveUser();
  const resendInvitation = useResendInvitation();
  const cancelInvitation = useCancelInvitation();
  const { user: currentUser, isAuthenticated } = useAppSelector(selectAuth);
  
  // Ensure user profile is loaded
  useProfile();

  // Debug logging
  console.log('Users page - currentUser:', currentUser);
  console.log('Users page - isAuthenticated:', isAuthenticated);

  const handleRemoveUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to remove ${userName} from the organization?`)) {
      try {
        await removeUser.mutateAsync(userId);
      } catch (error) {
        console.error('Failed to remove user:', error);
      }
    }
  };

  const handleResendInvitation = async (invitationId: string, email: string) => {
    setResendingInvitations(prev => new Set(prev).add(invitationId));
    try {
      const result = await resendInvitation.mutateAsync(invitationId);
      if (result.emailSent) {
        // Show the modal with the invitation link
        setResendModalData({
          isOpen: true,
          email,
          invitationLink: result.invitationLink
        });
      } else {
        alert(`Failed to send email: ${result.emailError || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to resend invitation:', error);
      alert('Failed to resend invitation');
    } finally {
      setResendingInvitations(prev => {
        const newSet = new Set(prev);
        newSet.delete(invitationId);
        return newSet;
      });
    }
  };

  const handleCancelInvitation = async (invitationId: string, email: string) => {
    if (window.confirm(`Are you sure you want to cancel the invitation for ${email}?`)) {
      setCancelingInvitations(prev => new Set(prev).add(invitationId));
      try {
        await cancelInvitation.mutateAsync(invitationId);
      } catch (error) {
        console.error('Failed to cancel invitation:', error);
        alert('Failed to cancel invitation');
      } finally {
        setCancelingInvitations(prev => {
          const newSet = new Set(prev);
          newSet.delete(invitationId);
          return newSet;
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load users</p>
      </div>
    );
  }

  const users = teamData?.users || [];
  const pendingInvitations = teamData?.pendingInvitations || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Team Members</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage users in your organization</p>
          </div>
          
          {isAuthenticated && (
            <Button 
              onClick={() => setIsInviteModalOpen(true)}
              disabled={!currentUser || currentUser?.role !== 'owner'}
              title={!currentUser ? 'Loading...' : currentUser?.role !== 'owner' ? 'Only organization owners can invite users' : ''}
              className="w-full sm:w-auto"
            >
              Invite User
            </Button>
          )}
        </div>

        {/* Active Team Members */}
        <Card className="p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Members</h2>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No active members found</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {users.map((user) => (
                <div 
                  key={user.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-200 rounded-lg gap-3 sm:gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-medium text-sm sm:text-base">
                          {user.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{user.displayName}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {user.isOwner ? 'Owner' : 'Member'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Joined {new Date(user.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {currentUser?.role === 'owner' && user.id !== currentUser.id && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRemoveUser(user.id, user.displayName)}
                        disabled={removeUser.isPending}
                        className="flex-shrink-0"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Pending Invitations */}
        {pendingInvitations.length > 0 && (
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Invitations</h2>
            <div className="space-y-3 sm:space-y-4">
              {pendingInvitations.map((invitation) => (
                <div 
                  key={invitation.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-200 rounded-lg bg-yellow-50 gap-3 sm:gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-yellow-600 font-medium text-sm sm:text-base">!</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{invitation.email}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Invited by {invitation.invitedByName} • {invitation.role}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {invitation.isExpired ? 'Expired' : 'Pending'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {invitation.isExpired ? 'Expired' : 'Expires'} {new Date(invitation.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {currentUser?.role === 'owner' && (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleResendInvitation(invitation.id, invitation.email)}
                          disabled={invitation.isExpired || resendingInvitations.has(invitation.id)}
                          className="flex-1 sm:flex-none"
                        >
                          {resendingInvitations.has(invitation.id) ? <LoadingSpinner size="sm" /> : 'Resend'}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCancelInvitation(invitation.id, invitation.email)}
                          disabled={cancelingInvitations.has(invitation.id)}
                          className="flex-1 sm:flex-none"
                        >
                          {cancelingInvitations.has(invitation.id) ? <LoadingSpinner size="sm" /> : 'Cancel'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <InviteUserModal 
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
        />
        
        <InvitationLinkModal
          isOpen={resendModalData.isOpen}
          onClose={() => setResendModalData({isOpen: false, email: '', invitationLink: ''})}
          invitationLink={resendModalData.invitationLink}
          email={resendModalData.email}
          title="Invitation Resent"
          successMessage="Invitation resent successfully!"
        />
        </div>
      </div>
    </div>
  );
}

export default Users;