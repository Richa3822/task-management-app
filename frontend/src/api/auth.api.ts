import { apiClient } from './axios';
import type { RegisterPayload, LoginPayload, AuthResponse } from '../types/auth.types';

export const authApi = {

    me: async (): Promise<AuthResponse> => {
        const { data } = await apiClient.get<AuthResponse>('/auth/me');
        return data;
    },
    
    register: async (payload: RegisterPayload): Promise<AuthResponse> => {
        const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
        return data;
    },

    login: async (payload: LoginPayload): Promise<AuthResponse> => {
        const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
        return data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
    },
};