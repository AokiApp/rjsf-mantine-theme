import {
  localToUTC,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
  labelValue,
  ariaDescribedByIds,
} from '@rjsf/utils';
import { useCallback } from 'react';

import { DateTimePicker } from '@mantine/dates';

/** The `DateTimeWidget` component uses the `BaseInputTemplate` changing the type to `datetime-local` and transforms
 * the value to/from utc using the appropriate utility functions.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function MantineDateTimeWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: WidgetProps<T, S, F>) {
  const {
    id,
    placeholder,
    label,
    hideLabel,
    value,
    required,
    readonly,
    disabled,
    onChange,
    onChangeOverride,
    autofocus,
    rawErrors = [],
  } = props;

  // TODO: options
  const inputValue = value ? new Date(value) : null;

  const _onChange = useCallback((value: Date | null) => onChange(value ? value.toJSON() : undefined), [onChange]);
  return (
    <DateTimePicker
      withSeconds
      value={inputValue}
      onChange={onChangeOverride || _onChange}
      key={id}
      id={id}
      placeholder={placeholder}
      label={labelValue(label, hideLabel, undefined)}
      required={required}
      clearable={!required}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      error={rawErrors.length > 0 ? rawErrors.map((error, i) => <span key={i}>{error}</span>) : false}
      aria-describedby={ariaDescribedByIds<T>(id)}
    />
  );
}
