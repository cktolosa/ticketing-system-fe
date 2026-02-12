export type Attachment = {
  filename: string;
  size: string;
};

export const statusOrder = {
  new: 1,
  'in progress': 2,
  resolved: 3,
  closed: 4,
} as const;

export type Status = keyof typeof statusOrder;

export const priorityOrder = {
  low: 1,
  medium: 2,
  high: 3,
} as const;

export type Priority = keyof typeof priorityOrder;

export type Comment = {
  id: number;
  author: string;
  timestamp: Date;
  comment: string;
  attachments?: Attachment[];
};

export type Ticket = {
  date: Date;
  title: string;
  department: string;
  admin: string;
  status: Status;
  priority: Priority;
};

export type History = {
  description: string;
  timestamp: Date;
};
