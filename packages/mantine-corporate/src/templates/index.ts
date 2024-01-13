import { FormContextType, RJSFSchema, StrictRJSFSchema, TemplatesType } from '@rjsf/utils';

import ErrorListTemplate from './ErrorListTemplate';
import FieldTemplate from './FieldTemplate';
import ObjectFieldTemplate from './ObjectFieldTemplate';
import TitleFieldTemplate from './TitleFieldTemplate';
import ArrayFieldItemTemplate from './ArrayFieldItemTemplate';
import ArrayFieldTemplate from './ArrayFieldTemplate';

export function generateTemplates<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(): Partial<TemplatesType<T, S, F>> {
  return {
    ArrayFieldItemTemplate,
    ArrayFieldTemplate,
    ErrorListTemplate,
    FieldTemplate,
    ObjectFieldTemplate,
    TitleFieldTemplate,
  };
}

export default generateTemplates();
