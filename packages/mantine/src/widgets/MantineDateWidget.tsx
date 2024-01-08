import {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
  labelValue,
  ariaDescribedByIds,
  getUiOptions,
} from '@rjsf/utils';
import { useCallback } from 'react';

import { DatePickerInput } from '@mantine/dates';

/** The `DateWidget` component uses the `BaseInputTemplate` changing the type to `date` and transforms
 * the value to undefined when it is falsy during the `onChange` handling.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function MantineDateWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
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
    uiSchema,
  } = props;

  const options = getUiOptions<T, S, F>(uiSchema);

  // TODO: options
  const inputValue = value ? fromRawDateStrToUtcTime(value) : null;

  const _onChange = useCallback(
    (value: Date | null) => onChange(value ? fromUtcTimeToRawDateStr(value) : undefined),
    [onChange],
  );
  return (
    <DatePickerInput
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
      {...(options.props as Record<string, unknown>)}
    />
  );
}
/**
 * Eliminate local time information which is converted into UTC and get pure date string
 *
 * Unlike the pair of date and time, the date in solo is generally not associated with any time zone in particular. (e.g. "Let's meet on Jan 8" doesn't imply arrival at exactly Jan 8, 00:00 UTC)
So the output should be date string, instead of Date object that have time information.
 * So the output should be date string, instead of Date object that have time information.
 * @param value Date in UTC
 * @returns Date string in YYYY-MM-DD format
 */
function fromUtcTimeToRawDateStr(value: Date | null) {
  if (value === null) {
    return null;
  }
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - new Date().getTimezoneOffset());
  return date.toISOString().split('T')[0];
}

/**
 * Reverse operation of fromUtcTimeToRawDateStr
 * @param value Date string in YYYY-MM-DD format
 * @returns Date in UTC
 */
function fromRawDateStrToUtcTime(value: string | null) {
  if (value === null) {
    return null;
  }
  const date = new Date(value);
  date.setMinutes(date.getMinutes() + new Date().getTimezoneOffset());
  return date;
}
