import type { Company } from '@/modules/companies';
import type { Department } from '@/modules/departments';
import type { Avatar } from '@/modules/profile';
import type { Role } from '@/stores/roles';

export type User = {
  id: number;
  name: string;
  email: string;
  company: Company;
  department: Department;
  role: Role;
  status: UserStatus;
  avatar?: Avatar;
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
