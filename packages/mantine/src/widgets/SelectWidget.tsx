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
import { MultiSelect, NativeSelect } from '@mantine/core';
import { createErrors } from '../utils/createErrors';
import { useFieldContext } from '../templates/FieldTemplate';

/** The `SelectWidget` is a widget for rendering dropdowns.
 *  It is typically used with string properties constrained with enum options.
 *
 * @param props - The `WidgetProps` for this component
 */
function SelectWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  id,
  options,
  value,
  required,
  disabled,
  readonly,
  label,
  hideLabel,
  rawErrors,
  multiple = false,
  autofocus = false,
  onChange,
  onBlur,
  onFocus,
  hideError,
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

  const { description } = useFieldContext();

  if (multiple) {
    return (
      <MultiSelect
        clearable={!required}
        data={(enumOptions || []).map(({ value, label }, i) => {
          const disabled = enumDisabled && enumDisabled.indexOf(value) !== -1;
          return { value: String(i), label, disabled };
        })}
        description={description}
        disabled={disabled || readonly}
        error={createErrors<T>(rawErrors, hideError)}
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
        className='armt-widget-select armt-widget-select-multiple'
      />
    );
  } else {
    const valuedData = (enumOptions || []).map(({ value, label }, i) => {
      const disabled = enumDisabled && enumDisabled.indexOf(value) !== -1;
      return { value: String(i), label, disabled };
    });
    const data = [{ value: '-1', label: placeholder || '' }, ...valuedData];
    return (
      <NativeSelect
        data={data}
        description={description}
        disabled={disabled || readonly}
        error={createErrors<T>(rawErrors, hideError)}
        label={labelValue(label, hideLabel, false)}
        autoFocus={autofocus}
        required={required}
        value={selectedIndices ?? '-1'}
        onChange={(event) => handleChange(event.currentTarget.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={ariaDescribedByIds<T>(id)}
        className='armt-widget-select armt-widget-select-single'
      />
    );
  }
}

export default SelectWidget;
