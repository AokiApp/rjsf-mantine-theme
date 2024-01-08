import { FormContextType, RJSFSchema, StrictRJSFSchema, TemplatesType } from '@rjsf/utils';

import BaseInputTemplate from './BaseInputTemplate';
import FieldErrorTemplate from './FieldErrorTemplate';
import ErrorListTemplate from './ErrorListTemplate';
import SubmitButton from './ButtonTemplates/SubmitButton';
import FieldTemplate from './FieldTemplate';

import { CopyButton, MoveDownButton, MoveUpButton, RemoveButton } from './ButtonTemplates/IconButton';
import AddButton from './ButtonTemplates/AddButton';
import WrapIfAdditionalTemplate from './WrapIfAdditionalTemplate';
import ObjectFieldTemplate from './ObjectFieldTemplate';
import TitleFieldTemplate from './TitleFieldTemplate';
import DescriptionFieldTemplate from './DescriptionFieldTemplate';
import ArrayFieldItemTemplate from './ArrayFieldItemTemplate';
import ArrayFieldTemplate from './ArrayFieldTemplate';
import FieldHelpTemplate from './FieldHelpTemplate';

export function generateTemplates<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(): Partial<TemplatesType<T, S, F>> {
  const ButtonTemplates = {
    SubmitButton,
    AddButton,
    RemoveButton,
    CopyButton,
    MoveDownButton,
    MoveUpButton,
  };
  return {
    ArrayFieldItemTemplate,
    ArrayFieldTemplate,
    BaseInputTemplate,
    FieldErrorTemplate,
    ErrorListTemplate,
    ButtonTemplates,
    FieldTemplate,
    FieldHelpTemplate,
    WrapIfAdditionalTemplate,
    ObjectFieldTemplate,
    TitleFieldTemplate,
    DescriptionFieldTemplate,
  };
}

export default generateTemplates();
