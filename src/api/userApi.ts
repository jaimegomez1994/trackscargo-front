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

export interface PendingInvitationResponse {
  id: string;
  email: string;
  role: string;
  invitedAt: string;
  expiresAt: string;
  invitedByName: string;
  isExpired: boolean;
}

export interface TeamMembersResponse {
  users: UserListResponse[];
  pendingInvitations: PendingInvitationResponse[];
}

// API functions
const userApi = {
  createInvitation: (data: CreateInvitationRequest): Promise<{ message: string; invitation: InvitationResponse }> =>
    apiClient.post('/users/invite', data),

  getUsers: (): Promise<{ users: UserListResponse[] }> =>
    apiClient.get('/users'),

  getTeamMembers: (): Promise<TeamMembersResponse> =>
    apiClient.get('/users/team-members'),

  resendInvitation: (invitationId: string): Promise<InvitationResponse & { emailSent?: boolean; emailError?: string }> =>
    apiClient.post(`/invitations/${invitationId}/resend`),

  cancelInvitation: (invitationId: string): Promise<{ message: string }> =>
    apiClient.delete(`/invitations/${invitationId}`),

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
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userApi.getUsers,
  });
};

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: userApi.getTeamMembers,
  });
};

export const useResendInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.resendInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
  });
};

export const useCancelInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.cancelInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
  });
};

export const useRemoveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.removeUser,
    onSuccess: () => {
      // Invalidate users list to refresh it
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
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