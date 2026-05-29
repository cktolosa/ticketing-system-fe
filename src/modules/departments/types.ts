import type { Company } from '../companies/types';
import type { User } from '../users/types';

export type Department = {
  id: number;
  name: string;
  company: Company;
  users?: User[];
};

export type DepartmentPayload = {
  id: number;
  company_id: string;
  name: string;
};
