import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignup } from '../api/authApi';
import { useAppSelector } from '../store/hooks';
import { selectAuth } from '../store/slices/authSlice';
import { Button } from '../components/ui';
import { PasswordInput } from '../components/ui/primitives/PasswordInput';

function Signup() {
  const navigate = useNavigate();
  const { error } = useAppSelector(selectAuth);
  const signupMutation = useSignup();

  const [formData, setFormData] = useState({
    organizationName: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!acceptedTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    try {
      await signupMutation.mutateAsync({
        organizationName: formData.organizationName,
        displayName: formData.displayName,
        email: formData.email,
        password: formData.password,
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.log("Signup error:", error);
      // Error is handled by the mutation
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const showPasswordMismatch = Boolean(formData.confirmPassword && !passwordsMatch);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2 text-primary no-underline">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path
                d="M12 2L2 7v10l10 5 10-5V7l-10-5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 7l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22V12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-2xl font-bold">Tracks Cargo</span>
          </Link>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your organization
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary-dark no-underline"
          >
            sign in to existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {(error || signupMutation.error) && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error || signupMutation.error?.message}
              </div>
            )}

            {/* Organization Name */}
            <div>
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
                Organization Name
              </label>
              <div className="mt-1">
                <input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  required
                  value={formData.organizationName}
                  onChange={handleChange('organizationName')}
                  disabled={signupMutation.isPending}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-50"
                  placeholder="Acme Logistics Inc."
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                This will be your company name in the system
              </p>
            </div>

            {/* Admin User Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                Your Full Name
              </label>
              <div className="mt-1">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={handleChange('displayName')}
                  disabled={signupMutation.isPending}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-50"
                  placeholder="John Smith"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange('email')}
                  disabled={signupMutation.isPending}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-50"
                  placeholder="john@acmelogistics.com"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                You'll use this email to sign in
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <PasswordInput
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange('password')}
                  placeholder="Enter a secure password"
                  required
                  disabled={signupMutation.isPending}
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  placeholder="Confirm your password"
                  required
                  disabled={signupMutation.isPending}
                  minLength={6}
                  autoComplete="new-password"
                  hasError={showPasswordMismatch}
                />
              </div>
              {showPasswordMismatch && (
                <p className="mt-1 text-xs text-red-600">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center">
              <input
                id="acceptedTerms"
                name="acceptedTerms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                disabled={signupMutation.isPending}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded disabled:opacity-50"
              />
              <label htmlFor="acceptedTerms" className="ml-2 block text-sm text-gray-900">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                disabled={signupMutation.isPending || !acceptedTerms || showPasswordMismatch}
                loading={signupMutation.isPending}
                fullWidth
              >
                Create Organization
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                as={Link}
                to="/login"
                variant="secondary"
                fullWidth
                className="no-underline"
              >
                Sign in to existing account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;