import { FormContextType, RJSFSchema, StrictRJSFSchema, TemplatesType } from '@rjsf/utils';

import ErrorListTemplate from './ErrorListTemplate';
import ObjectFieldTemplate from './ObjectFieldTemplate';
import TitleFieldTemplate from './TitleFieldTemplate';
import ArrayFieldTemplate from './ArrayFieldTemplate';
import ArrayFieldItemTemplate from './ArrayFieldItemTemplate';

export function generateTemplates<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(): Partial<TemplatesType<T, S, F>> {
  return {
    ArrayFieldTemplate,
    ErrorListTemplate,
    ObjectFieldTemplate,
    TitleFieldTemplate,
    ArrayFieldItemTemplate,
  };
}

export default generateTemplates();
