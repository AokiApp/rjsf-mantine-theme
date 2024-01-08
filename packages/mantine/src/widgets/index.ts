import { FormContextType, RegistryWidgetsType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';

import SelectWidget from './SelectWidget';
import RadioWidget from './RadioWidget';
import CheckboxesWidget from './CheckboxesWidget';
import CheckboxWidget from './CheckboxWidget';
import TextareaWidget from './TextareaWidget';
import MantineDateWidget from './MantineDateWidget';
import MantineDateTimeWidget from './MantineDateTimeWidget';
import AltDateTimeWidget from './AltDateTimeWidget';
import AltDateWidget from './AltDateWidget';
import RangeWidget from './RangeWidget';
import RatingWidget from './RatingWidget';
import FileWidget from './FileWidget';

export function generateWidgets<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(): RegistryWidgetsType<T, S, F> {
  return {
    CheckboxWidget,
    CheckboxesWidget,
    RadioWidget,
    SelectWidget,
    TextareaWidget,
    MantineDateTimeWidget,
    MantineDateWidget,
    AltDateWidget,
    AltDateTimeWidget,
    RangeWidget,
    RatingWidget,
    FileWidget,
  };
}

export default generateWidgets();
