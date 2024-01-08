import { FocusEvent } from 'react';
import {
  ADDITIONAL_PROPERTY_FLAG,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  TranslatableString,
  WrapIfAdditionalTemplateProps,
} from '@rjsf/utils';
import { Group, TextInput, Box } from '@mantine/core';

/** The `WrapIfAdditional` component is used by the `FieldTemplate` to rename, or remove properties that are
 * part of an `additionalProperties` part of a schema.
 *
 * @param props - The `WrapIfAdditionalProps` for this component
 */
export default function WrapIfAdditionalTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: WrapIfAdditionalTemplateProps<T, S, F>) {
  const {
    children,
    classNames,
    style,
    disabled,
    id,
    label,
    onDropPropertyClick,
    onKeyChange,
    readonly,
    required,
    schema,
    uiSchema,
    registry,
  } = props;
  const { templates, translateString } = registry;
  // Button templates are not overridden in the uiSchema
  const { RemoveButton } = templates.ButtonTemplates;
  const keyLabel = translateString(TranslatableString.KeyLabel, [label]);
  const { readonlyAsDisabled = true, wrapperStyle } = registry.formContext;

  const additional = ADDITIONAL_PROPERTY_FLAG in schema;

  if (!additional) {
    return (
      <div className={classNames} style={style}>
        {children}
      </div>
    );
  }

  const handleBlur = ({ target }: FocusEvent<HTMLInputElement>) => onKeyChange(target.value);

  return (
    <div className={classNames} style={style} key={`${id}-key`}>
      <Group align='center'>
        <TextInput // key input
          label={keyLabel}
          required={required}
          defaultValue={label}
          disabled={disabled || (readonlyAsDisabled && readonly)}
          id={id}
          name={id}
          onBlur={!readonly ? handleBlur : undefined}
          style={wrapperStyle}
          type='text'
        />
        <Box
          style={{ flexGrow: 1 }} // value input as children
        >
          {children}
        </Box>
        <RemoveButton
          className='array-item-remove'
          disabled={disabled || readonly}
          onClick={onDropPropertyClick(label)}
          uiSchema={uiSchema}
          registry={registry}
        />
      </Group>
    </div>
  );
}
