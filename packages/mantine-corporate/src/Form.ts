import { ComponentType } from 'react';
import { withTheme, FormProps } from '@rjsf/core';
import { generateTheme as generateThemeCustom } from './theme';
import { generateTheme as generateThemeBase } from '@aokiapp/rjsf-mantine-theme';
import { FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';

export function generateForm<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(): ComponentType<FormProps<T, S, F>> {
  return withTheme<T, S, F>({
    ...generateThemeCustom<T, S, F>(),
    ...generateThemeBase<T, S, F>(),
  });
}

export default generateForm();
