export type User = {
  profile?: File;
  name: string;
  email: string;
  department: string;
  role: string;
  status: UserStatus;
};

export type UserStatus = 'active' | 'inactive';
