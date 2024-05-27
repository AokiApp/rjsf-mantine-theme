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
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useState } from 'react';
import classes from './ArrayFieldTemplate.module.css';
import { IconCopy, IconTrash } from '@tabler/icons-react';
import ArrayFieldItemTemplate from './ArrayFieldItemTemplate'; // do not use getTemplate here

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

  const orderable = (uiOptions.orderable ?? false) && !readonly && !disabled;
  const removable = (uiOptions.removable ?? true) && !readonly && !disabled;
  const copyable = (uiOptions.copyable ?? false) && !readonly && !disabled;

  const [isDragging, setIsDragging] = useState(false);

  let arrItems;
  if (items && items.length > 0) {
    arrItems = (
      <>
        <Divider my='xs' label={`${_title || '配列'} の先頭`} labelPosition='center' />
        <DragDropContext
          onBeforeCapture={() => setIsDragging(true)}
          onDragEnd={({ destination, source }) => {
            setIsDragging(false);
            if (destination?.droppableId === 'array') {
              // ad hoc solution for calling onReorderClick
              items[0].onReorderClick(source.index, destination?.index || 0)();
            } else if (destination?.droppableId === 'copy') {
              items[0].onCopyIndexClick(source.index)();
            } else if (destination?.droppableId === 'remove') {
              items[0].onDropIndexClick(source.index)();
            }
          }}
        >
          <Droppable droppableId='array' direction='vertical'>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {items.map(({ key, ...itemProps }: ArrayFieldTemplateItemType<T, S, F>) => {
                  return (
                    <ArrayFieldItemTemplate key={key} {...itemProps} orderable={orderable} removable={!!removable} />
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {items[0].hasToolbar && isDragging && (
            <Group m='sm'>
              {copyable && (
                <DropToAction icon={<IconCopy />} label='コピー' className={classes.dropToCopy} droppableId='copy' />
              )}
              {removable && (
                <DropToAction icon={<IconTrash />} label='削除' className={classes.dropToRemove} droppableId='remove' />
              )}
            </Group>
          )}
        </DragDropContext>
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

function DropToAction({
  icon,
  label,
  className,
  droppableId,
}: {
  icon: React.ReactNode;
  label: string;
  className: string;
  droppableId: string;
}) {
  return (
    <Droppable droppableId={droppableId} direction='horizontal'>
      {(provided, snapshot) => (
        <div
          className={`${classes.dropToAction} ${className} ${snapshot.isDraggingOver && classes.dtaDraggingOver}`}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <div className={classes.dtaIcon}>{icon}</div>
          <div className={classes.dtaLabel}>{label}</div>
        </div>
      )}
    </Droppable>
  );
}
