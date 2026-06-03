import type { Role } from '@/stores/roles';

import type { Company } from '../companies/types';
import type { Department } from '../departments/types';

export type User = {
  id: number;
  name: string;
  email: string;
  company: Company;
  department: Department;
  role: Role;
  status: UserStatus;
  avatar?: File;
};

export type UserPayload = {
  avatar?: File;
  name: string;
  email: string;
  password?: string;
  company_id: number;
  department_id: number;
  role_id: number;
  is_active?: boolean;
};

export type UserStatus = 'active' | 'inactive';
