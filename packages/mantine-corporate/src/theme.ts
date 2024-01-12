import { ThemeProps } from '@rjsf/core';

import { generateTemplates as generateTemplatesBase } from '@aokiapp/rjsf-mantine-theme';
import { generateTemplates as generateTemplatesCustom } from './templates';
import { generateWidgets as generateWidgetsBase } from '@aokiapp/rjsf-mantine-theme';
import { generateWidgets as generateWidgetsCustom } from './widgets';
import { FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';

export function generateTheme<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(): ThemeProps<T, S, F> {
  return {
    templates: {
      ...generateTemplatesBase<T, S, F>(),
      ...generateTemplatesCustom<T, S, F>(),
    },
    widgets: {
      ...generateWidgetsBase<T, S, F>(),
      ...generateWidgetsCustom<T, S, F>(),
    },
  };
}

export default generateTheme();
