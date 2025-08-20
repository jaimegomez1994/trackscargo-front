import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvitationDetails, useAcceptInvitation } from '../api/userApi';
import { Button } from '../components/ui/primitives/Button';
import { Card } from '../components/ui/primitives/Card';
import { LoadingSpinner } from '../components/ui/primitives/LoadingSpinner';
import { PasswordInput } from '../components/ui/primitives/PasswordInput';

function AcceptInvitation() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: '',
    password: '',
    confirmPassword: '',
  });

  const { data: invitation, isLoading, error } = useInvitationDetails(token || '');
  const acceptInvitation = useAcceptInvitation();

  useEffect(() => {
    if (invitation?.email && !formData.displayName) {
      // Pre-fill display name with email username
      const emailUsername = invitation.email.split('@')[0];
      setFormData(prev => ({
        ...prev,
        displayName: emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1)
      }));
    }
  }, [invitation?.email, formData.displayName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (field: 'password' | 'confirmPassword') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const showPasswordMismatch = Boolean(formData.confirmPassword && !passwordsMatch);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      await acceptInvitation.mutateAsync({
        token: token!,
        data: {
          displayName: formData.displayName,
          password: formData.password,
        }
      });

      // Redirect to login page with success message
      navigate('/login?invited=true');
    } catch (error) {
      console.error('Failed to accept invitation:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            Invitation Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            This invitation link is invalid or has expired.
          </p>
          <Button onClick={() => navigate('/login')} variant="secondary">
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  if (!invitation.isValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            Invitation Expired
          </h1>
          <p className="text-gray-600 mb-6">
            This invitation has expired or has already been used.
          </p>
          <Button onClick={() => navigate('/login')} variant="secondary">
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Join {invitation.organizationName}
          </h1>
          <p className="text-gray-600">
            You've been invited by {invitation.invitedByName} to join their organization
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-blue-800 font-medium">
              Invitation for: {invitation.email}
            </p>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Role: {invitation.role}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handlePasswordChange('password')}
              placeholder="Create a password"
              required
              minLength={6}
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 6 characters long
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handlePasswordChange('confirmPassword')}
              placeholder="Confirm your password"
              required
              minLength={6}
              className="w-full"
              hasError={showPasswordMismatch}
            />
            {showPasswordMismatch && (
              <p className="mt-1 text-xs text-red-600">
                Passwords do not match
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={acceptInvitation.isPending}
          >
            {acceptInvitation.isPending ? <LoadingSpinner size="sm" /> : 'Accept Invitation'}
          </Button>

          {acceptInvitation.error && (
            <p className="text-sm text-red-600 text-center">
              {acceptInvitation.error instanceof Error ? acceptInvitation.error.message : 'Failed to accept invitation'}
            </p>
          )}
        </form>

        <div className="mt-6 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/login')}
            className="text-sm"
          >
            Already have an account? Sign in
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default AcceptInvitation;