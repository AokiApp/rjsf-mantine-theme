import { ArrayFieldTemplateItemType, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { Group, Box } from '@mantine/core';

/** The `ArrayFieldItemTemplate` component is the template used to render an items of an array.
 *
 * @param props - The `ArrayFieldTemplateItemType` props for the component
 */
export default function ArrayFieldItemTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: ArrayFieldTemplateItemType<T, S, F>) {
  const {
    children,
    disabled,
    hasToolbar,
    hasCopy,
    hasMoveDown,
    hasMoveUp,
    hasRemove,
    index,
    onCopyIndexClick,
    onDropIndexClick,
    onReorderClick,
    readonly,
    uiSchema,
    registry,
  } = props;
  const { CopyButton, MoveDownButton, MoveUpButton, RemoveButton } = registry.templates.ButtonTemplates;

  return (
    <Box>
      {children}
      {hasToolbar && (hasMoveUp || hasMoveDown || hasRemove || hasCopy) && (
        <Group justify='flex-end'>
          {(hasMoveUp || hasMoveDown) && (
            <MoveUpButton
              className='array-item-move-up'
              disabled={disabled || readonly || !hasMoveUp}
              onClick={onReorderClick(index, index - 1)}
              uiSchema={uiSchema}
              registry={registry}
            />
          )}
          {(hasMoveUp || hasMoveDown) && (
            <MoveDownButton
              className='array-item-move-down'
              disabled={disabled || readonly || !hasMoveDown}
              onClick={onReorderClick(index, index + 1)}
              uiSchema={uiSchema}
              registry={registry}
            />
          )}
          {hasCopy && (
            <CopyButton
              className='array-item-copy'
              disabled={disabled || readonly}
              onClick={onCopyIndexClick(index)}
              uiSchema={uiSchema}
              registry={registry}
            />
          )}
          {hasRemove && (
            <RemoveButton
              className='array-item-remove'
              disabled={disabled || readonly}
              onClick={onDropIndexClick(index)}
              uiSchema={uiSchema}
              registry={registry}
            />
          )}
        </Group>
      )}
    </Box>
  );
}
