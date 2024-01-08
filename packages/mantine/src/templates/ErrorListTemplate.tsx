import { Alert, List, Spoiler } from '@mantine/core';
import { ErrorListProps, FormContextType, RJSFSchema, StrictRJSFSchema, TranslatableString } from '@rjsf/utils';
import { IconZoomExclamation } from '@tabler/icons-react';

/** The `ErrorList` component is the template that renders the all the errors associated with the fields in the `Form`
 *
 * @param props - The `ErrorListProps` for this component
 */
export default function ErrorList<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  errors,
  registry,
}: ErrorListProps<T, S, F>) {
  const { translateString } = registry;
  return (
    <Alert title={translateString(TranslatableString.ErrorsLabel)} icon={<IconZoomExclamation />}>
      <Spoiler maxHeight={120} showLabel='Show more' hideLabel='Hide'>
        <List size='sm'>
          {errors.map((error, index) => (
            <List.Item key={`error-${index}`}>{error.stack}</List.Item>
          ))}
        </List>
      </Spoiler>
    </Alert>
  );
}
