import { FormProps } from '@rjsf/core';
import { ReactNode } from 'react';

export type Sample = Omit<FormProps, 'validator'> & {
  description?: ReactNode;
};
