import { FormContextType, TitleFieldProps, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { Title } from '@mantine/core';

const REQUIRED_FIELD_SYMBOL = '*';

/** The `TitleField` is the template to use to render the title of a field
 *
 * @param props - The `TitleFieldProps` for this component
 */
export default function TitleField<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  title,
  required,
}: TitleFieldProps<T, S, F>) {
  if (!title) {
    return null;
  }
  return (
    <Title order={5} className='armt-template-title'>
      {title}
      {required && <span className='required'>{REQUIRED_FIELD_SYMBOL}</span>}
    </Title>
  );
}
