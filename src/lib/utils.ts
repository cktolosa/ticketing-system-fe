import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { TrendingDown, TrendingUp } from 'lucide-vue-next';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date, opts?: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,

    // moving `opts` here instead of setting default values in the parameters
    // so if we want e.g. `year`, we can overwrite `year` itself instead of
    // affecting other opts such as `month`, `day`, etc.
    ...opts,
  }).format(date);
};

export function transformToSelectOption<T>(
  array: T[],
  {
    labelKey,
    valueKey,
  }: {
    labelKey: keyof T;
    valueKey: keyof T;
  }
) {
  return array.map((element) => ({
    label: element[labelKey],
    value: element[valueKey],
  }));
}

export const formatPercentage = (percentage: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(percentage);
};

export const getTrend = (percentage: number) => {
  const isPositive = percentage >= 0;
  return {
    trend: isPositive ? 'increased' : 'decreased',
    icon: isPositive ? TrendingUp : TrendingDown,
    color: isPositive ? 'text-green-500' : 'text-destructive',
    border: isPositive ? 'border-green-500' : 'border-destructive',
  };
};
