import { ActionIcon, ButtonProps } from '@mantine/core';
import { FormContextType, IconButtonProps, RJSFSchema, StrictRJSFSchema, TranslatableString } from '@rjsf/utils';
import { IconChevronDown, IconChevronUp, IconCopy, IconTrash } from '@tabler/icons-react';

function IconButton<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: IconButtonProps<T, S, F>
) {
  // eliminate uiSchema and registry from props, which are not accepted by ActionIcon
  const { iconType, icon, uiSchema: _uiSchema, registry: _registry, color, title, ...rest } = props;
  return (
    <ActionIcon
      size={iconType as ButtonProps['size']}
      variant='light'
      color={color as ButtonProps['color']}
      aria-label={title}
      title={title}
      role='button'
      {...rest}
    >
      {icon}
    </ActionIcon>
  );
}

export default IconButton;

export function CopyButton<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: IconButtonProps<T, S, F>
) {
  const {
    registry: { translateString },
  } = props;
  return <IconButton title={translateString(TranslatableString.CopyButton)} {...props} icon={<IconCopy />} />;
}

export function MoveDownButton<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: IconButtonProps<T, S, F>
) {
  const {
    registry: { translateString },
  } = props;
  return (
    <IconButton title={translateString(TranslatableString.MoveDownButton)} {...props} icon={<IconChevronDown />} />
  );
}

export function MoveUpButton<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: IconButtonProps<T, S, F>
) {
  const {
    registry: { translateString },
  } = props;
  return <IconButton title={translateString(TranslatableString.MoveUpButton)} {...props} icon={<IconChevronUp />} />;
}

export function RemoveButton<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: IconButtonProps<T, S, F>
) {
  const {
    registry: { translateString },
  } = props;
  return (
    <IconButton title={translateString(TranslatableString.RemoveButton)} color='red' {...props} icon={<IconTrash />} />
  );
}
