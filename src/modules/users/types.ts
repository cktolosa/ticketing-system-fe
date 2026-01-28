export type User = {
  profile?: File;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'inactive';
};

export type UserStatus = 'active' | 'inactive';
