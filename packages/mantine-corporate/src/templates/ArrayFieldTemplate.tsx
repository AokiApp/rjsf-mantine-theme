import {
  getTemplate,
  getUiOptions,
  ArrayFieldTemplateProps,
  ArrayFieldTemplateItemType,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';

import { Group, Box, Divider } from '@mantine/core';

/** The `ArrayFieldTemplate` component is the template used to render all items in an array.
 *
 * @param props - The `ArrayFieldTemplateItemType` props for the component
 */
export default function ArrayFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: ArrayFieldTemplateProps<T, S, F>) {
  const {
    canAdd,
    className,
    disabled,
    idSchema,
    uiSchema,
    items,
    onAddClick,
    readonly,
    registry,
    required,
    schema,
    title,
  } = props;
  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const ArrayFieldDescriptionTemplate = getTemplate<'ArrayFieldDescriptionTemplate', T, S, F>(
    'ArrayFieldDescriptionTemplate',
    registry,
    uiOptions,
  );
  const ArrayFieldItemTemplate = getTemplate<'ArrayFieldItemTemplate', T, S, F>(
    'ArrayFieldItemTemplate',
    registry,
    uiOptions,
  );
  const ArrayFieldTitleTemplate = getTemplate<'ArrayFieldTitleTemplate', T, S, F>(
    'ArrayFieldTitleTemplate',
    registry,
    uiOptions,
  );
  // Button templates are not overridden in the uiSchema
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;

  const _title = uiOptions.title || title;
  const legendNode = (
    <Group gap='xs'>
      {title && (
        <ArrayFieldTitleTemplate
          idSchema={idSchema}
          title={_title}
          required={required}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}

      <ArrayFieldDescriptionTemplate
        idSchema={idSchema}
        description={uiOptions.description || schema.description}
        schema={schema}
        uiSchema={uiSchema}
        registry={registry}
      />
    </Group>
  );

  let arrItems;
  if (items && items.length > 0) {
    arrItems = (
      <>
        <Divider my='xs' label={`${_title || '配列'} の先頭`} labelPosition='center' />
        {items.map(({ key, ...itemProps }: ArrayFieldTemplateItemType<T, S, F>) => (
          <ArrayFieldItemTemplate key={key} {...itemProps} />
        ))}{' '}
        <Divider my='xs' label={`${_title || '配列'} の末尾`} labelPosition='center' />
      </>
    );
  } else {
    arrItems = <Divider my='xs' label={`${_title || '配列'} は空です`} labelPosition='center' />;
  }

  return (
    <Box
      id={idSchema.$id}
      style={{
        width: '100%',
      }}
      className={`armt-template-arrayfield ${className}`}
    >
      <Group gap='xs' justify='space-between'>
        {legendNode}
        {canAdd && (
          <AddButton onClick={onAddClick} disabled={disabled || readonly} uiSchema={uiSchema} registry={registry} />
        )}
      </Group>
      {arrItems}
    </Box>
  );
}
