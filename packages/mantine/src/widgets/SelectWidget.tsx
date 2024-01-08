import { useCallback } from 'react';
import {
  ariaDescribedByIds,
  enumOptionsIndexForValue,
  enumOptionsValueForIndex,
  FormContextType,
  labelValue,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from '@rjsf/utils';
import { MultiSelect, Select } from '@mantine/core';

/** The `SelectWidget` is a widget for rendering dropdowns.
 *  It is typically used with string properties constrained with enum options.
 *
 * @param props - The `WidgetProps` for this component
 */
function SelectWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  schema,
  id,
  options,
  value,
  required,
  disabled,
  readonly,
  label,
  hideLabel,
  rawErrors = [],
  multiple = false,
  autofocus = false,
  onChange,
  onBlur,
  onFocus,
  placeholder,
}: WidgetProps<T, S, F>) {
  const { enumOptions, enumDisabled, emptyValue: optEmptyVal } = options;

  const selectedIndices = enumOptionsIndexForValue<S>(value, enumOptions, multiple);

  // Bypassing null check here because enumOptionsValueForIndex will falls into emptyValue if matching fails
  const handleFocus = useCallback(() => {
    return onFocus(id, enumOptionsValueForIndex<S>(selectedIndices!, enumOptions, optEmptyVal));
  }, [onFocus, id, selectedIndices, enumOptions, optEmptyVal]);

  const handleBlur = useCallback(() => {
    return onBlur(id, enumOptionsValueForIndex<S>(selectedIndices!, enumOptions, optEmptyVal));
  }, [onBlur, id, selectedIndices, enumOptions, optEmptyVal]);

  const handleChange = useCallback(
    (value: string | null | string[]) => {
      return onChange(enumOptionsValueForIndex<S>(value!, enumOptions, optEmptyVal));
    },
    [onChange, enumOptions, optEmptyVal],
  );

  if (multiple) {
    return (
      <MultiSelect
        clearable={!required}
        data={(enumOptions || []).map(({ value, label }, i) => {
          const disabled = enumDisabled && enumDisabled.indexOf(value) !== -1;
          return { value: String(i), label, disabled };
        })}
        description={schema.description}
        disabled={disabled || readonly}
        error={rawErrors.length > 0 ? rawErrors.map((error, i) => <span key={i}>{error}</span>) : false}
        label={labelValue(label, hideLabel, false)}
        autoFocus={autofocus}
        required={required}
        searchable
        value={selectedIndices as string[]}
        onChange={handleChange}
        onDropdownClose={handleBlur}
        onDropdownOpen={handleFocus}
        aria-describedby={ariaDescribedByIds<T>(id)}
        placeholder={placeholder}
      />
    );
  } else {
    return (
      <Select
        allowDeselect
        checkIconPosition='right'
        clearable={!required}
        data={(enumOptions || []).map(({ value, label }, i) => {
          const disabled = enumDisabled && enumDisabled.indexOf(value) !== -1;
          return { value: String(i), label, disabled };
        })}
        description={schema.description}
        disabled={disabled || readonly}
        error={rawErrors.length > 0 ? rawErrors.map((error, i) => <span key={i}>{error}</span>) : false}
        label={labelValue(label, hideLabel, false)}
        autoFocus={autofocus}
        required={required}
        searchable
        value={selectedIndices as string | null}
        onChange={handleChange}
        onDropdownClose={handleBlur}
        onDropdownOpen={handleFocus}
        aria-describedby={ariaDescribedByIds<T>(id)}
        placeholder={placeholder}
      />
    );
  }
}

export default SelectWidget;
