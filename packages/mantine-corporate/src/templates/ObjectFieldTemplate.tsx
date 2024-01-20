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
import classes from './ObjectFieldTemplate.module.css';
import { IconChevronDown } from '@tabler/icons-react';

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
    <Group onClick={toggle} className={classes.legend} justify='space-between'>
      <Group>
        {title && (
          <Text size='sm' fw={500} id={titleId<T>(idSchema)} role='heading' c='white'>
            {title}
          </Text>
        )}
        {description && (
          <Text size='xs' id={descriptionId<T>(idSchema)} c='white'>
            {description}
          </Text>
        )}
      </Group>
      <IconChevronDown color='white' />
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
    >
      {legendNode}
      <Collapse in={opened}>
        <Box px='xs'>{properties.map((prop: ObjectFieldTemplatePropertyType) => prop.content)}</Box>
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
