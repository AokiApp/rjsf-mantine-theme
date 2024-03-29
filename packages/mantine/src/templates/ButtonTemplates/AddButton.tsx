import { Button, ButtonProps } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

import { FormContextType, IconButtonProps, RJSFSchema, StrictRJSFSchema, TranslatableString } from '@rjsf/utils';

/** The `AddButton` renders a button that represent the `Add` action on a form
 */
export default function AddButton<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  uiSchema,
  registry,
  color,
  ...props
}: IconButtonProps<T, S, F>) {
  const { translateString } = registry;
  return (
    <Button
      title={translateString(TranslatableString.AddItemButton)}
      color={color as ButtonProps['color']}
      variant='light'
      {...props}
      leftSection={<IconPlus />}
    >
      {translateString(TranslatableString.AddItemButton)}
    </Button>
  );
}
