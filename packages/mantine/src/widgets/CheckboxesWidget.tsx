import {
  ariaDescribedByIds,
  optionId,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
  labelValue,
  enumOptionsValueForIndex,
  enumOptionsIndexForValue,
} from '@rjsf/utils';
import { Box, Checkbox } from '@mantine/core';
import { FocusEvent, useCallback } from 'react';

/** The `CheckboxesWidget` is a widget for rendering checkbox groups.
 *  It is typically used to represent an array of enums.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function CheckboxesWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: WidgetProps<T, S, F>) {
  const {
    id,
    disabled,
    options: { inline = false, enumOptions, enumDisabled, emptyValue, ...options },
    value,
    autofocus,
    readonly,
    label,
    hideLabel,
    onChange,
    onBlur,
    onFocus,
    schema,
    required,
    rawErrors = [],
  } = props;

  const checkboxesValues = Array.isArray(value) ? value : [value];

  const selectedIndices = enumOptionsIndexForValue<S>(checkboxesValues, enumOptions, true) as string[];

  const handleBlur = useCallback(
    ({ target: { value } }: FocusEvent<HTMLInputElement>) =>
      onBlur(id, enumOptionsValueForIndex<S>(value, enumOptions, emptyValue)),
    [onBlur, id]
  );

  const handleFocus = useCallback(
    ({ target: { value } }: FocusEvent<HTMLInputElement>) =>
      onFocus(id, enumOptionsValueForIndex<S>(value, enumOptions, emptyValue)),
    [onFocus, id]
  );

  const description = options.description ?? schema.description;

  const _onChange = (nextIndices: string[]) => {
    const nextValues = enumOptionsValueForIndex<S>(nextIndices, enumOptions, []) as T[];
    onChange(nextValues);
  };
  return (
    <Checkbox.Group
      label={labelValue(label, hideLabel, false)}
      description={description}
      error={rawErrors.length > 0 ? rawErrors.map((error, i) => <span key={i}>{error}</span>) : false}
      onChange={_onChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      value={selectedIndices}
      id={id}
      required={required}
      autoFocus={autofocus}
    >
      <Box
        style={{
          display: 'flex',
          flexDirection: inline ? 'row' : 'column',
          gap: '0.5rem',
        }}
      >
        {enumOptions?.map((option, index) => {
          return (
            <Checkbox
              id={optionId(id, index)}
              key={index}
              label={option.label}
              value={enumOptionsIndexForValue<S>(option.value, enumOptions, false) as string}
              disabled={disabled || readonly || (enumDisabled ?? []).includes(index)}
              name={id}
              aria-describedby={ariaDescribedByIds<T>(id)}
            />
          );
        })}
      </Box>
    </Checkbox.Group>
  );
}
