export type User = {
  id: number;
  name: string;
  email: string;
  company: string;
  department: string;
  role: string;
  status: UserStatus;
  avatar?: File;
};

export type UserStatus = 'active' | 'inactive';
