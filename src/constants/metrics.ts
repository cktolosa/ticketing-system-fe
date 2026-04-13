export interface MetricMeta {
  title: string;
  description: string;
  recommendation: string;
  unit: string;
}

export type SUMetricKey = 'resolution_rate' | 'priority_resolution' | 'user_activity' | 'faq_views';
export type AdminMetricKey = 'new_tickets' | 'resolved_tickets' | 'overdue_tickets' | 'faq_views';
export type SupportMetricKey =
  | 'new_tickets'
  | 'in_progress_tickets'
  | 'overdue_tickets'
  | 'faq_views';
export type UserMetricKey =
  | 'new_tickets'
  | 'in_progress_tickets'
  | 'resolved_tickets'
  | 'closed_tickets';

export const SU_METRIC_META: Record<SUMetricKey, MetricMeta> = {
  resolution_rate: {
    title: 'Resolution Rate',
    unit: 'tickets',
    description: 'Total of resolved tickets',
    recommendation: 'Monitor resolution rate trends to ensure efficient ticket handling.',
  },
  priority_resolution: {
    title: 'Priority Resolution',
    unit: 'tickets',
    description: 'Closed high-urgency tickets',
    recommendation: 'Prioritize high-urgency tickets for smooth operations.',
  },
  user_activity: {
    title: 'User Activity',
    unit: 'users',
    description: 'Users system engagement',
    recommendation: 'Track engagement to identify improvement opportunities.',
  },
  faq_views: {
    title: 'FAQ Views',
    unit: 'views',
    description: 'Total FAQ page visits',
    recommendation: 'Keep articles updated to reduce repetitive tickets.',
  },
};

export const ADMIN_METRIC_META: Record<AdminMetricKey, MetricMeta> = {
  new_tickets: {
    title: 'New Tickets',
    unit: 'tickets',
    description: 'Active unresolved tickets',
    recommendation: 'Review and assign new tickets promptly to prevent backlogs.',
  },
  resolved_tickets: {
    title: 'Resolved Tickets',
    unit: 'tickets',
    description: 'Successfully closed tickets',
    recommendation: 'Monitor trends to evaluate resolution efficiency.',
  },
  overdue_tickets: {
    title: 'At-Risk Tickets',
    unit: 'tickets',
    description: 'Tickets at or past their due date',
    recommendation: 'Review and prioritize at-risk tickets to keep resolution on track.',
  },
  faq_views: {
    title: 'FAQ Views',
    unit: 'views',
    description: 'Total FAQ page visits',
    recommendation: 'Keep articles updated to reduce repetitive tickets.',
  },
};

export const SUPPORT_METRIC_META: Record<SupportMetricKey, MetricMeta> = {
  new_tickets: {
    title: 'New Tickets',
    unit: 'tickets',
    description: 'Active unresolved tickets',
    recommendation: 'Review new tickets promptly to prevent backlogs.',
  },
  in_progress_tickets: {
    title: 'In Progress Tickets',
    unit: 'tickets',
    description: 'Tickets currently being worked on',
    recommendation: 'Keep in-progress tickets moving to avoid resolution delays.',
  },
  overdue_tickets: {
    title: 'Overdue Tickets',
    unit: 'tickets',
    description: 'Tickets at or past their due date',
    recommendation: 'Review and prioritize overdue tickets to keep resolution on track.',
  },
  faq_views: {
    title: 'FAQ Views',
    unit: 'views',
    description: 'Total FAQ page visits',
    recommendation: 'Keep articles updated to reduce repetitive tickets.',
  },
};

export const USER_METRIC_META: Record<UserMetricKey, MetricMeta> = {
  new_tickets: {
    title: 'New Tickets',
    unit: 'tickets',
    description: 'Your active unresolved tickets',
    recommendation: 'Check your new tickets for any updates or required action.',
  },
  in_progress_tickets: {
    title: 'In Progress Tickets',
    unit: 'tickets',
    description: 'Tickets currently being worked on',
    recommendation: 'Keep in-progress tickets moving to avoid resolution delays.',
  },
  resolved_tickets: {
    title: 'Resolved Tickets',
    unit: 'tickets',
    description: 'Your successfully closed tickets',
    recommendation: 'Support is actively working on these. Updates will follow shortly.',
  },
  closed_tickets: {
    title: 'Closed Tickets',
    unit: 'tickets',
    description: 'Your permanently closed tickets',
    recommendation: 'Closed tickets are no longer active. Submit a new ticket if needed.',
  },
};
