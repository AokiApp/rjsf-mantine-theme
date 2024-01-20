import { NumberInput } from '@mantine/core';
import {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
  ariaDescribedByIds,
  labelValue,
} from '@rjsf/utils';
import { FocusEvent, useCallback } from 'react';
import { createErrors } from '../utils/createErrors';

/** The `UpDownWidget` component uses the `BaseInputTemplate` changing the type to `number`.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function UpDownWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>,
) {
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
    onBlur,
    onFocus,
    autofocus,
    options,
    schema,
    rawErrors,
    className,
    hideError,
  } = props;

  // Note: since React 15.2.0 we can't forward unknown element attributes, so we
  // exclude the "options" and "schema" ones here.
  if (!id) {
    console.log('No id for', props);
    throw new Error(`no id for props ${JSON.stringify(props)}`);
  }

  // Mantine NumberInput have many customizations such as suffix, decimal scale, thousands separator, etc.
  const overrideProps = typeof options['props'] === 'object' ? options['props'] : {};

  const _onChange = useCallback(
    (e: string | number) => {
      const callTarget = onChangeOverride || onChange;
      callTarget(e);
    },
    [onChangeOverride, onChange],
  );

  const _onBlur = useCallback(({ target: { value } }: FocusEvent<HTMLInputElement>) => onBlur(id, value), [onBlur, id]);
  const _onFocus = useCallback(
    ({ target: { value } }: FocusEvent<HTMLInputElement>) => onFocus(id, value),
    [onFocus, id],
  );

  const inputValue = value || value === 0 ? value : '';
  return (
    <NumberInput
      key={id}
      id={id}
      placeholder={placeholder}
      description={schema.description}
      max={schema.maximum}
      min={schema.minimum}
      label={labelValue(label, hideLabel, undefined)}
      required={required}
      autoFocus={autofocus}
      disabled={disabled || readonly}
      value={inputValue}
      error={createErrors<T>(rawErrors, hideError)}
      onChange={_onChange}
      onBlur={_onBlur}
      onFocus={_onFocus}
      aria-describedby={ariaDescribedByIds<T>(id, !!schema.examples)}
      className={`armt-widget-updown ${className || ''}`}
      {...overrideProps}
    />
  );
}
