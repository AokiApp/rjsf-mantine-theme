import { Input, Slider } from '@mantine/core';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps, getInputProps, labelValue } from '@rjsf/utils';
import { useCallback } from 'react';
import { createErrors } from '../utils/createErrors';
import { useFieldContext } from '../templates/FieldTemplate';

/** The `RangeWidget` component uses the `BaseInputTemplate` changing the type to `range` and wrapping the result
 * in a div, with the value along side it.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function RangeWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>,
) {
  const {
    id,
    label,
    hideLabel,
    value,
    required,
    readonly,
    disabled,
    onChange,
    onChangeOverride,
    onBlur,
    autofocus,
    options,
    schema,
    type,
    rawErrors,
    hideError,
  } = props;

  if (!id) {
    console.log('No id for', props);
    throw new Error(`no id for props ${JSON.stringify(props)}`);
  }

  const inputProps = getInputProps<T, S, F>(schema, type, options);

  const _onChange = useCallback(
    (value: number) => onChange(value === 0 ? options.emptyValue : value),
    [onChange, options],
  );
  const _onBlur = useCallback((value: number) => onBlur(id, value), [onBlur, id]);

  const { description } = useFieldContext();
  return (
    <Input.Wrapper
      label={labelValue(label, hideLabel)}
      description={description}
      id={id}
      error={createErrors<T>(rawErrors, hideError)}
      required={required}
      className='armt-widget-range'
    >
      <Slider
        disabled={disabled || readonly}
        autoFocus={autofocus}
        value={value}
        onChange={onChangeOverride || _onChange}
        onChangeEnd={_onBlur}
        {...inputProps}
        step={inputProps.step === 'any' ? undefined : inputProps.step}
      />
    </Input.Wrapper>
  );
}
