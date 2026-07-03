import type { Department } from '@modules/departments';

export type Company = {
  id: number;
  name: string;
  departments: Department[];
};
