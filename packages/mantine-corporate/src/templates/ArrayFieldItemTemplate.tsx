import { ArrayFieldTemplateItemType, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { Group, Box, Stack, rem } from '@mantine/core';
import { Draggable } from '@hello-pangea/dnd';
import { IconGripVertical } from '@tabler/icons-react';
import classes from './ArrayFieldTemplate.module.css';
import { useId } from 'react';
/** The `ArrayFieldItemTemplate` component is the template used to render an items of an array.
 *
 * @param props - The `ArrayFieldTemplateItemType` props for the component
 */
export default function ArrayFieldItemTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: ArrayFieldTemplateItemType<T, S, F>) {
  const {
    children,
    className,
    disabled,
    hasToolbar,
    hasCopy,
    hasMoveDown,
    hasMoveUp,
    hasRemove,
    index,
    onCopyIndexClick,
    onDropIndexClick,
    readonly,
    uiSchema,
    registry,
  } = props;
  const { CopyButton, RemoveButton } = registry.templates.ButtonTemplates;
  const isDraggable = !disabled && !readonly && hasToolbar && (hasMoveDown || hasMoveUp);
  const key = useId();
  return (
    <Draggable index={index} draggableId={key} key={key} isDragDisabled={!isDraggable}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`armt-template-arrayfielditem ${className}`}
        >
          <Group style={{ flexGrow: 1 }}>
            {isDraggable && (
              <div {...provided.dragHandleProps} className={classes.dragHandle}>
                <IconGripVertical style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
              </div>
            )}
            <Box style={{ flexGrow: 1 }}>{children}</Box>
            <Stack gap='4px'>
              {hasRemove && (
                <RemoveButton
                  className='armt-template-afit-remove'
                  disabled={disabled || readonly}
                  onClick={onDropIndexClick(index)}
                  uiSchema={uiSchema}
                  registry={registry}
                />
              )}

              {hasCopy && (
                <CopyButton
                  className='armt-template-afit-copy'
                  disabled={disabled || readonly}
                  onClick={onCopyIndexClick(index)}
                  uiSchema={uiSchema}
                  registry={registry}
                />
              )}
            </Stack>
          </Group>
        </Box>
      )}
    </Draggable>
  );
}
