import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { SelectOption } from './types';

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
