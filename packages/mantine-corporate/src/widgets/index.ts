import { FormContextType, RegistryWidgetsType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';

import FileWidget from './FileWidget';
import PillInputWidget from './PillInputWidget';

export function generateWidgets<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(): RegistryWidgetsType<T, S, F> {
  return {
    FileWidget,
    PillInputWidget,
  };
}

export default generateWidgets();
