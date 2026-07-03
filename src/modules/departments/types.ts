import type { Company } from '@/modules/companies';
import type { User } from '@/modules/users';

export type Department = {
  id: number;
  name: string;
  company: Company;
  users?: User[];
};

export type DepartmentPayload = {
  company_id: string;
  name: string;
};
