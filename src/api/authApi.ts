import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess, setUserProfile, setError, logout } from '../store/slices/authSlice';

// Types
export interface SignupRequest {
  organizationName: string;
  email: string;
  password: string;
  displayName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    role: 'owner' | 'member';
  };
  organization: {
    id: string;
    name: string;
    slug: string;
    plan: string;
  };
}

export interface UserProfileResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
    role: 'owner' | 'member';
    avatarUrl?: string;
  };
  organization: {
    id: string;
    name: string;
    slug: string;
    plan: string;
    maxUsers?: number;
    maxShipmentsPerMonth?: number;
  };
}

// API functions
const authApi = {
  signup: (data: SignupRequest): Promise<AuthResponse> =>
    apiClient.post('/auth/signup', data),

  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiClient.post('/auth/login', data),

  getProfile: (): Promise<UserProfileResponse> =>
    apiClient.get('/auth/me'),
};

// React Query hooks
export const useSignup = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      dispatch(loginSuccess(data));
      // Invalidate queries that depend on auth
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
    },
    onError: (error: Error) => {
      dispatch(setError(error.message));
    },
  });
};

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      dispatch(loginSuccess(data));
      // Invalidate queries that depend on auth
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
    },
    onError: (error: Error) => {
      dispatch(setError(error.message));
    },
  });
};

export const useProfile = () => {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: ['profile'],
    queryFn: authApi.getProfile,
    retry: false,
  });

  // Handle success/error with useEffect or in component
  if (query.isSuccess && query.data) {
    dispatch(setUserProfile(query.data));
  }

  if (query.isError) {
    dispatch(logout());
  }

  return query;
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // No API call needed for logout, just clear local state
      return Promise.resolve();
    },
    onSuccess: () => {
      dispatch(logout());
      // Clear all cached data
      queryClient.clear();
    },
  });
};