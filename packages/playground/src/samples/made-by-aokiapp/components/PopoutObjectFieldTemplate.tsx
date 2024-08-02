import { Box, Stack, Button, Modal, Drawer, Popover } from '@mantine/core';
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
import { IconExternalLink } from '@tabler/icons-react';

/** The `PopoutObjectFieldTemplate` is the ObjectFieldTemplate but with a presentation of some popout.
 *
 * @param props - The `ObjectFieldTemplateProps` for this component
 */
export default function PopoutObjectFieldTemplate<
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

  const [opened, { toggle }] = useDisclosure(false);

  const classNames = options.classNames;

  const content = (
    <Stack id={idSchema.$id} role='group' gap={'xs'} className={`armt-template-objectfield-popout ${classNames ?? ''}`}>
      {description && (
        <DescriptionFieldTemplate
          id={descriptionId<T>(idSchema)}
          description={description}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
      <Box className='armt-template-objectfield-item'>
        {properties.map((prop: ObjectFieldTemplatePropertyType) => prop.content)}
      </Box>
      {canExpand<T, S, F>(schema, uiSchema, formData) && (
        <AddButton
          className='object-property-expand'
          onClick={onAddClick(schema)}
          disabled={disabled || readonly}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
    </Stack>
  );

  const trigger = (
    <Box
      style={{
        display: 'inline-block',
      }}
    >
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
      <Button onClick={toggle} rightSection={<IconExternalLink />} m='md'>
        {title} を編集
      </Button>
    </Box>
  );

  let PopoutComponent;

  switch (options.popoutType) {
    case 'popover':
      // exceptional case
      return (
        <Popover opened={opened} onChange={toggle} width={(options.size as any) || 350} trapFocus>
          <Popover.Target>{trigger}</Popover.Target>
          <Popover.Dropdown>{content}</Popover.Dropdown>
        </Popover>
      );
      break;
    case 'modal':
      PopoutComponent = Modal;
      break;
    case 'drawer':
    default:
      PopoutComponent = Drawer;
      break;
  }

  return (
    <>
      {trigger}
      <PopoutComponent opened={opened} onClose={toggle} title={title} size={(options.size as any) || 'xl'}>
        {content}
      </PopoutComponent>
    </>
  );
}
