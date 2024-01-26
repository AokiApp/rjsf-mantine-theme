import { createErrors } from '@aokiapp/rjsf-mantine-theme';
import { Pill, PillsInput } from '@mantine/core';
import {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
  labelValue,
  ariaDescribedByIds,
} from '@rjsf/utils';
import { useCallback, useMemo, useState } from 'react';

/**
 * The `PillInputWidget` is the special case of the array field where the user can enter a value and press enter to add
 * it to the array.
 * The schema of this widget must match the follwing criteria:
 * - type: array
 * - items: type: string
 * - uniqueItems: true
 */
export default function PillInputWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  id,
  placeholder,
  label,
  hideLabel,
  value,
  required,
  readonly,
  disabled,
  onChange: onChangeBase,
  onChangeOverride,
  autofocus,
  rawErrors,
  hideError,
  schema,
  options: { description, removeOnBackspace = false, punctuation = null },
}: WidgetProps<T, S, F>) {
  // check the schema criteria
  if (
    schema.type !== 'array' ||
    typeof schema.items !== 'object' ||
    Array.isArray(schema.items) ||
    schema.items.type !== 'string'
  ) {
    throw new Error('The PillInputWidget is only compatible with a schema that is an array of unique strings');
  }

  // field-level controls start
  const _value = useMemo(() => (Array.isArray(value) ? value : []), [value]);
  const onChange = onChangeOverride || onChangeBase;
  const onRemove = useCallback(
    (i: number) => {
      onChange(_value.filter((_, index) => index !== i));
    },
    [_value, onChange],
  );

  const onAdd = useCallback(
    (value: string) => {
      onChange([..._value, value]);
    },
    [_value, onChange],
  );
  // add multiple values at once
  // I need this onAdd can be called within one render
  const onBulkAdd = useCallback(
    (values: string[]) => {
      onChange([..._value, ...values]);
    },
    [_value, onChange],
  );

  const currentPills = _value.map((v, i) => (
    <Pill
      key={i}
      withRemoveButton={!disabled && !readonly}
      onRemove={() => {
        onRemove(i);
      }}
    >
      {v}
    </Pill>
  ));
  // field-level controls end

  // pill input start
  const [tmpValue, setTmpValue] = useState('');
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (typeof punctuation === 'string' && punctuation.length) {
        // split by punctuation
        const split = v.split(punctuation);
        // add all but the last one
        onBulkAdd(split.slice(0, -1));
        // set the last one as the tmp value
        setTmpValue(split[split.length - 1]);
      } else {
        setTmpValue(v);
      }
    },
    [onBulkAdd, punctuation],
  );

  // Japanese IME support
  const [isComposing, setIsComposing] = useState(false);
  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, [setIsComposing]);
  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, [setIsComposing]);

  const handleBlur = useCallback(() => {
    if (tmpValue) {
      onAdd(tmpValue);
      setTmpValue('');
    }
  }, [tmpValue, onAdd]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // handle enter air shot
      if (e.key === 'Enter' && !isComposing && tmpValue) {
        e.preventDefault(); // without this, enter will trigger the form submit
        onAdd(tmpValue);
        setTmpValue('');
      }
      // handle backspace when empty
      if (e.key === 'Backspace' && !tmpValue && _value.length > 0) {
        e.preventDefault(); // without this, the last character also gets deleted
        const last = _value[_value.length - 1];
        onRemove(_value.length - 1);
        if (!removeOnBackspace) {
          setTmpValue(last);
        }
      }
    },
    [isComposing, tmpValue, _value, onAdd, onRemove, removeOnBackspace],
  );
  const pillInput = (
    <PillsInput.Field
      placeholder={placeholder}
      id={id}
      value={tmpValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      autoFocus={autofocus}
      disabled={disabled || readonly}
      onBlur={handleBlur}
    />
  );
  // pill input end
  return (
    <PillsInput
      label={labelValue(label, hideLabel, undefined)}
      description={description}
      disabled={disabled || readonly}
      error={createErrors<T>(rawErrors, hideError)}
      aria-describedby={ariaDescribedByIds<T>(id)}
      required={required}
      className='armt-widget-pill-input'
    >
      <Pill.Group>
        {currentPills}
        {pillInput}
      </Pill.Group>
    </PillsInput>
  );
}
