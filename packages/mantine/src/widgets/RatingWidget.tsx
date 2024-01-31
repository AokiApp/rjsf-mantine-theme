import { Input, Rating } from '@mantine/core';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps, labelValue } from '@rjsf/utils';
import { useCallback } from 'react';
import { createErrors } from '../utils/createErrors';
import { useFieldContext } from '../templates/FieldTemplate';

/** The `RangeWidget` component uses the `BaseInputTemplate` changing the type to `range` and wrapping the result
 * in a div, with the value along side it.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function RatingWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
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
    autofocus,
    options,
    schema,
    rawErrors,
    hideError,
  } = props;

  if (!id) {
    console.log('No id for', props);
    throw new Error(`no id for props ${JSON.stringify(props)}`);
  }

  const mx = Math.floor(schema.maximum ?? 5);
  const mn = Math.floor(schema.minimum ?? 0);

  const _onChange = useCallback((value: number) => onChange(value - 1 + mn), [mn, onChange]);

  const count = mx - mn + 1;
  const frac = 1 / (schema.multipleOf ?? 1);

  const ival = value - mn + 1;

  const { description } = useFieldContext();
  return (
    <Input.Wrapper
      label={labelValue(label, hideLabel)}
      description={description}
      id={id}
      error={createErrors<T>(rawErrors, hideError)}
      required={required}
      className='armt-widget-rating'
    >
      <Rating
        readOnly={disabled || readonly}
        autoFocus={autofocus}
        value={ival}
        onChange={onChangeOverride || _onChange}
        count={count}
        fractions={frac}
        size='xl'
      />
    </Input.Wrapper>
  );
}
