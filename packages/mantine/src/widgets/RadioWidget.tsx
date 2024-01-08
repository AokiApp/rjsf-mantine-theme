import {
  ariaDescribedByIds,
  enumOptionsValueForIndex,
  optionId,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
  enumOptionsIndexForValue,
  labelValue,
} from '@rjsf/utils';

import { Group, Radio } from '@mantine/core';

/** The `RadioWidget` is a widget for rendering a radio group.
 *  It is typically used with a string property constrained with enum options.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function RadioWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>
) {
  const {
    id,
    value,
    required,
    disabled,
    readonly,
    hideLabel,
    label,
    onChange,
    onBlur,
    onFocus,
    options,
    rawErrors = [],
  } = props;
  const { enumOptions, enumDisabled, emptyValue } = options;
  const _onChange = (nextValue: any) => {
    onChange(enumOptionsValueForIndex<S>(nextValue, enumOptions, emptyValue));
  };

  const _onBlur = () => onBlur(id, value);
  const _onFocus = () => onFocus(id, value);

  return (
    <Radio.Group
      name={id}
      label={labelValue(label || undefined, hideLabel, false)}
      description={options.description}
      required={required}
      value={enumOptionsIndexForValue<S>(value, enumOptions, false) as string | undefined} // since I set multiple to false, this should not be an array, so I need to cast and suppress the error
      onChange={_onChange}
      onBlur={_onBlur}
      onFocus={_onFocus}
      error={rawErrors.length > 0 ? rawErrors.map((error, i) => <span key={i}>{error}</span>) : false}
    >
      <Group>
        {enumOptions?.map((option, index) => {
          const itemDisabled = enumDisabled && enumDisabled.indexOf(option.value) !== -1;
          return (
            <Radio
              id={optionId(id, index)}
              name={id}
              label={option.label}
              value={enumOptionsIndexForValue<S>(option.value, enumOptions, false) as string}
              key={index}
              disabled={disabled || itemDisabled || readonly}
              aria-describedby={ariaDescribedByIds<T>(id)}
            />
          );
        })}
      </Group>
    </Radio.Group>
  );
}
