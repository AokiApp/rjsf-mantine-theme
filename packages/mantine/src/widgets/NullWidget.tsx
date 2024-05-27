import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps, descriptionId, getTemplate } from '@rjsf/utils';

/** The `NullWidget` is the template to use to render a null widget
 * It is not present in the original library.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function NullWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>,
) {
  const { id, label, hideLabel, required, options, schema, className, registry } = props;

  const TitleFieldTemplate = getTemplate<'TitleFieldTemplate', T, S, F>('TitleFieldTemplate', registry, options);
  const DescriptionFieldTemplate = getTemplate<'DescriptionFieldTemplate', T, S, F>(
    'DescriptionFieldTemplate',
    registry,
    options,
  );
  const description = options.description || schema.description;
  return (
    <div className={`armt-widget-null ${className || ''}`} id={id}>
      {label && !hideLabel && (
        <TitleFieldTemplate id={id} title={label} required={required} schema={schema} registry={registry} />
      )}
      {description && !hideLabel && (
        <DescriptionFieldTemplate
          id={descriptionId<T>(id)}
          description={description}
          registry={registry}
          schema={schema}
        />
      )}
    </div>
  );
}
