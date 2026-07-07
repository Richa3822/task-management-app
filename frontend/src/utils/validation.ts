import * as yup from 'yup';
import type { Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

export const loginSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const registerSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const loginResolver = yupResolver(loginSchema) as Resolver<LoginFormValues>;
export const registerResolver = yupResolver(registerSchema) as Resolver<RegisterFormValues>;

export interface TaskFormValues {
    title: string;
    description?: string;
  }
  
  export const taskSchema = yup.object({
    title: yup.string().trim().required('Title is required'),
    description: yup.string().trim().optional(),
  });
  
  export const taskResolver = yupResolver(taskSchema) as Resolver<TaskFormValues>;