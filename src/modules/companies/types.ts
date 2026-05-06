import type { Department } from '../departments/types';

export type Company = {
  id: number;
  name: string;
  departments: Department[];
};
