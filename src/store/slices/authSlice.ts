import { createSlice } from '@reduxjs/toolkit';

// Define PayloadAction type locally if import fails
type PayloadAction<T = void> = {
  payload: T;
  type: string;
};
import { tokenManager } from '../../lib/api';

// Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'owner' | 'member';
  avatarUrl?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  maxUsers?: number;
  maxShipmentsPerMonth?: number;
}

export interface AuthState {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  organization: null,
  isAuthenticated: tokenManager.isValid(),
  isLoading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    // Login success
    loginSuccess: (state, action: PayloadAction<{
      user: User;
      organization: Organization;
      token: string;
    }>) => {
      const { user, organization, token } = action.payload;
      
      state.user = user;
      state.organization = organization;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      
      // Store token
      tokenManager.set(token);
    },

    // Set user profile (for /me endpoint)
    setUserProfile: (state, action: PayloadAction<{
      user: User;
      organization: Organization;
    }>) => {
      state.user = action.payload.user;
      state.organization = action.payload.organization;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    // Update user info
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Update organization info
    updateOrganization: (state, action: PayloadAction<Partial<Organization>>) => {
      if (state.organization) {
        state.organization = { ...state.organization, ...action.payload };
      }
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.organization = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      
      // Remove token
      tokenManager.remove();
    },

    // Set error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Initialize auth (check token on app start)
    initializeAuth: (state) => {
      state.isAuthenticated = tokenManager.isValid();
      if (!state.isAuthenticated) {
        // Token is invalid, clear everything
        state.user = null;
        state.organization = null;
        tokenManager.remove();
      }
    },
  },
});

// Actions
export const {
  setLoading,
  loginSuccess,
  setUserProfile,
  updateUser,
  updateOrganization,
  logout,
  setError,
  clearError,
  initializeAuth,
} = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectOrganization = (state: { auth: AuthState }) => state.auth.organization;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsOwner = (state: { auth: AuthState }) => state.auth.user?.role === 'owner';

// Reducer
export default authSlice.reducer;