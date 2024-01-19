import { Group, Box, Collapse, Text, Stack } from '@mantine/core';
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
} from '@rjsf/utils';

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
    //required,
    schema,
    title,
    uiSchema,
  } = props;
  //const options = getUiOptions<T, S, F>(uiSchema);
  // const TitleFieldTemplate = getTemplate<'TitleFieldTemplate', T, S, F>('TitleFieldTemplate', registry, options);
  // const DescriptionFieldTemplate = getTemplate<'DescriptionFieldTemplate', T, S, F>(
  //   'DescriptionFieldTemplate',
  //   registry,
  //   options,
  // );
  // Button templates are not overridden in the uiSchema
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;

  const [opened, { toggle }] = useDisclosure(true);

  const legendNode = (
    <Group gap='xs' p='xs' onClick={toggle} bg='indigo' role='button' aria-describedby={descriptionId<T>(idSchema)}>
      {title && (
        // <TitleFieldTemplate
        //   id={titleId<T>(idSchema)}
        //   title={title}
        //   required={required}
        //   schema={schema}
        //   uiSchema={uiSchema}
        //   registry={registry}
        // />
        <Text size='sm' fw={500} id={titleId<T>(idSchema)} c='white' role='heading'>
          {title}
        </Text>
      )}
      {description && (
        // <DescriptionFieldTemplate
        //   id={descriptionId<T>(idSchema)}
        //   description={description}
        //   schema={schema}
        //   uiSchema={uiSchema}
        //   registry={registry}
        // />
        <Text size='xs' c='white' id={descriptionId<T>(idSchema)}>
          {description}
        </Text>
      )}
    </Group>
  );
  return (
    <Stack
      id={idSchema.$id}
      style={{
        width: '100%',
      }}
      role='group'
    >
      {legendNode}
      <Collapse in={opened}>
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
