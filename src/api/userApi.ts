import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

// Types
export interface CreateInvitationRequest {
  email: string;
  role?: string;
}

export interface AcceptInvitationRequest {
  password: string;
  displayName: string;
}

export interface InvitationResponse {
  id: string;
  email: string;
  role: string;
  invitationToken: string;
  invitationLink: string;
  expiresAt: string;
  createdAt: string;
}

export interface InvitationDetailsResponse {
  id: string;
  email: string;
  role: string;
  organizationName: string;
  invitedByName: string;
  expiresAt: string;
  isValid: boolean;
}

export interface UserListResponse {
  id: string;
  email: string;
  displayName: string;
  role: string;
  joinedAt: string;
  lastLoginAt?: string;
  isOwner: boolean;
}

// API functions
const userApi = {
  createInvitation: (data: CreateInvitationRequest): Promise<{ message: string; invitation: InvitationResponse }> =>
    apiClient.post('/users/invite', data),

  getUsers: (): Promise<{ users: UserListResponse[] }> =>
    apiClient.get('/users'),

  removeUser: (userId: string): Promise<{ message: string }> =>
    apiClient.delete(`/users/${userId}`),

  getInvitationDetails: (token: string): Promise<InvitationDetailsResponse> =>
    apiClient.get(`/invitations/${token}`),

  acceptInvitation: (token: string, data: AcceptInvitationRequest): Promise<{ message: string }> =>
    apiClient.post(`/invitations/${token}/accept`, data),
};

// React Query hooks
export const useCreateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.createInvitation,
    onSuccess: () => {
      // Invalidate users list to refresh it
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userApi.getUsers,
  });
};

export const useRemoveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.removeUser,
    onSuccess: () => {
      // Invalidate users list to refresh it
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useInvitationDetails = (token: string) => {
  return useQuery({
    queryKey: ['invitation', token],
    queryFn: () => userApi.getInvitationDetails(token),
    enabled: !!token,
    retry: false,
  });
};

export const useAcceptInvitation = () => {
  return useMutation({
    mutationFn: ({ token, data }: { token: string; data: AcceptInvitationRequest }) =>
      userApi.acceptInvitation(token, data),
  });
};