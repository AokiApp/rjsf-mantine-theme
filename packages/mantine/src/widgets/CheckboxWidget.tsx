import {
  ariaDescribedByIds,
  labelValue,
  schemaRequiresTrueValue,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from '@rjsf/utils';
import { ChangeEvent, FocusEvent, useCallback } from 'react';
import { Checkbox } from '@mantine/core';
import { createErrors } from '../utils/createErrors';
import { useFieldContext } from '../templates/FieldTemplate';

/** The `CheckBoxWidget` is a widget for rendering boolean properties.
 *  It is typically used to represent a boolean.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function CheckboxWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const {
    id,
    value,
    disabled,
    readonly,
    label = '',
    hideLabel,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    schema,
    rawErrors,
    hideError,
  } = props;

  // Because an unchecked checkbox will cause html5 validation to fail, only add
  // the "required" attribute if the field value must be "true", due to the
  // "const" or "enum" keywords
  const required = schemaRequiresTrueValue<S>(schema);
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.checked),
    [onChange],
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => onBlur(id, event.target.checked),
    [onBlur, id],
  );

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>) => onFocus(id, event.target.checked),
    [onFocus, id],
  );

  const { description } = useFieldContext();
  return (
    <Checkbox
      description={description}
      id={id}
      label={labelValue(label, hideLabel)}
      required={required}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      error={createErrors<T>(rawErrors, hideError)}
      aria-describedby={ariaDescribedByIds<T>(id)}
      checked={typeof value === 'undefined' ? false : value}
      className='armt-widget-checkbox'
    />
  );
}
