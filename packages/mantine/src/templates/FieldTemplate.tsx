import {
  FieldTemplateProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  getTemplate,
  getUiOptions,
} from '@rjsf/utils';

/** The `FieldTemplate` component is the template used by `SchemaField` to render any field. It renders the field
 * content, (label, description, children, errors and help) inside of a `WrapIfAdditional` component.
 *
 * @param props - The `FieldTemplateProps` for this component
 */
export default function FieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: FieldTemplateProps<T, S, F>) {
  const { id, children, classNames, style, label, help, hidden, registry, schema, uiSchema, ...otherProps } = props;
  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const WrapIfAdditionalTemplate = getTemplate<'WrapIfAdditionalTemplate', T, S, F>(
    'WrapIfAdditionalTemplate',
    registry,
    uiOptions
  );

  if (hidden) {
    return <div style={{ display: 'none' }}>{children}</div>;
  }

  // TODO: If there is a field or template that don't support label or description, add exceptions here
  return (
    <WrapIfAdditionalTemplate
      classNames={classNames}
      style={style}
      id={id}
      label={label}
      registry={registry}
      schema={schema}
      uiSchema={uiSchema}
      {...otherProps}
    >
      {children}
      {help}
    </WrapIfAdditionalTemplate>
  );
}
