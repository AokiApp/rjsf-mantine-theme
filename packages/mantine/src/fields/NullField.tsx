import { useEffect } from 'react';
import { FieldProps, FormContextType, RJSFSchema, StrictRJSFSchema, getUiOptions, getWidget } from '@rjsf/utils';

/** The `NullField` component is used to render a field in the schema is null. It also ensures that the `formData` is
 * also set to null if it has no value.
 *
 * Differences from the original:
 * - Traverse the widget and use it
 * - By default, use `NullWidget`, which is not present in the original
 * - Hence, null fields can be replaced with custom ones
 *
 * @param props - The `FieldProps` for this template
 */
function NullField<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: FieldProps<T, S, F>,
) {
  const {
    schema,
    name,
    uiSchema,
    idSchema,
    formData,
    required,
    disabled = false,
    readonly = false,
    autofocus = false,
    onChange,
    onBlur,
    onFocus,
    registry,
    rawErrors,
    hideError,
  } = props;

  const { title } = schema;
  const { widgets, formContext, schemaUtils, globalUiOptions } = registry;
  const { widget = 'NullWidget', placeholder = '', title: uiTitle, ...options } = getUiOptions<T, S, F>(uiSchema);
  const displayLabel = schemaUtils.getDisplayLabel(schema, uiSchema, globalUiOptions);
  const label = uiTitle ?? title ?? name;
  const Widget = getWidget<T, S, F>(schema, widget, widgets);

  useEffect(() => {
    if (formData === undefined) {
      onChange(null as unknown as T);
    }
  }, [formData, onChange]);

  return (
    <Widget
      options={options}
      schema={schema}
      uiSchema={uiSchema}
      id={idSchema.$id}
      name={name}
      label={label}
      hideLabel={!displayLabel}
      hideError={hideError}
      value={formData}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      required={required}
      disabled={disabled}
      readonly={readonly}
      formContext={formContext}
      autofocus={autofocus}
      registry={registry}
      placeholder={placeholder}
      rawErrors={rawErrors}
    />
  );
}

export default NullField;
