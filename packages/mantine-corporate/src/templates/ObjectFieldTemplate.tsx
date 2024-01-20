import { Group, Box, Collapse, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  FormContextType,
  ObjectFieldTemplatePropertyType,
  ObjectFieldTemplateProps,
  RJSFSchema,
  StrictRJSFSchema,
  canExpand,
  descriptionId,
  titleId,
  getUiOptions,
  getTemplate,
} from '@rjsf/utils';
import classes from './ObjectFieldTemplate.module.css';
import { IconChevronUp } from '@tabler/icons-react';

/** The `ObjectFieldTemplate` is the template to use to render all the inner properties of an object along with the
 * title and description if available. If the object is expandable, then an `AddButton` is also rendered after all
 * the properties.
 *
 * @param props - The `ObjectFieldTemplateProps` for this component
 */
export default function ObjectFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: ObjectFieldTemplateProps<T, S, F>) {
  const {
    description,
    disabled,
    formData,
    idSchema,
    onAddClick,
    properties,
    readonly,
    registry,
    required,
    schema,
    title,
    uiSchema,
  } = props;
  const options = getUiOptions<T, S, F>(uiSchema);
  const TitleFieldTemplate = getTemplate<'TitleFieldTemplate', T, S, F>('TitleFieldTemplate', registry, options);
  const DescriptionFieldTemplate = getTemplate<'DescriptionFieldTemplate', T, S, F>(
    'DescriptionFieldTemplate',
    registry,
    options,
  );
  // Button templates are not overridden in the uiSchema
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;

  const [opened, { toggle }] = useDisclosure(true);

  const classNames = options.classNames;
  const legendNode = (
    <Group onClick={toggle} className={classes.legend} justify='space-between'>
      <Group>
        {title && (
          <TitleFieldTemplate
            id={titleId<T>(idSchema)}
            title={title}
            required={required}
            schema={schema}
            uiSchema={uiSchema}
            registry={registry}
          />
        )}
        {description && (
          <DescriptionFieldTemplate
            id={descriptionId<T>(idSchema)}
            description={description}
            schema={schema}
            uiSchema={uiSchema}
            registry={registry}
          />
        )}
      </Group>
      <IconChevronUp />
    </Group>
  );
  return (
    <Stack
      id={idSchema.$id}
      style={{
        width: '100%',
      }}
      role='group'
      gap={'xs'}
      className={`armt-template-objectfield ${classNames ?? ''} ${classes.root}`}
    >
      {legendNode}
      <Collapse in={opened} className={classes.collapse}>
        <Box>{properties.map((prop: ObjectFieldTemplatePropertyType) => prop.content)}</Box>
        {canExpand<T, S, F>(schema, uiSchema, formData) && (
          <AddButton
            className='object-property-expand'
            onClick={onAddClick(schema)}
            disabled={disabled || readonly}
            uiSchema={uiSchema}
            registry={registry}
          />
        )}
      </Collapse>
    </Stack>
  );
}
