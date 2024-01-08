import { ChangeEvent, FocusEvent, useCallback } from 'react';
import { TextInput } from '@mantine/core';

import {
  ariaDescribedByIds,
  BaseInputTemplateProps,
  examplesId,
  getInputProps,
  labelValue,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';

/** The `BaseInputTemplate` is the template to use to render the basic `<input>` component for the `core` theme.
 * It is used as the template for rendering many of the <input> based widgets that differ by `type` and callbacks only.
 * It can be customized/overridden for other themes or individual implementations as needed.
 *
 * @param props - The `WidgetProps` for this template
 */
export default function BaseInputTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: BaseInputTemplateProps<T, S, F>) {
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
    type,
    rawErrors = [],
  } = props;

  // Note: since React 15.2.0 we can't forward unknown element attributes, so we
  // exclude the "options" and "schema" ones here.
  if (!id) {
    console.log('No id for', props);
    throw new Error(`no id for props ${JSON.stringify(props)}`);
  }
  const inputProps = getInputProps<T, S, F>(schema, type, options);

  let inputValue;
  if (inputProps.type === 'number' || inputProps.type === 'integer') {
    inputValue = value || value === 0 ? value : '';
  } else {
    inputValue = value == null ? '' : value;
  }

  const _onChange = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => onChange(value === '' ? options.emptyValue : value),
    [onChange, options],
  );
  const _onBlur = useCallback(({ target: { value } }: FocusEvent<HTMLInputElement>) => onBlur(id, value), [onBlur, id]);
  const _onFocus = useCallback(
    ({ target: { value } }: FocusEvent<HTMLInputElement>) => onFocus(id, value),
    [onFocus, id],
  );

  return (
    <>
      <TextInput
        key={id}
        id={id}
        placeholder={placeholder}
        description={schema.description}
        {...inputProps}
        label={labelValue(label, hideLabel, undefined)}
        required={required}
        autoFocus={autofocus}
        disabled={disabled || readonly}
        list={schema.examples ? examplesId<T>(id) : undefined}
        value={inputValue}
        error={rawErrors.length > 0 ? rawErrors.map((error, i) => <span key={i}>{error}</span>) : false}
        onChange={onChangeOverride || _onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        aria-describedby={ariaDescribedByIds<T>(id, !!schema.examples)}
      />
      {Array.isArray(schema.examples) && (
        <datalist id={examplesId<T>(id)}>
          {(schema.examples as string[])
            .concat(schema.default && !schema.examples.includes(schema.default) ? ([schema.default] as string[]) : [])
            .map((example) => {
              return <option key={example} value={example} />;
            })}
        </datalist>
      )}
    </>
  );
}
