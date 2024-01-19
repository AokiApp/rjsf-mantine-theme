import { FieldErrorProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { createErrors } from '../utils/createErrors';

/** The `FieldErrorTemplate` component renders the errors local to the particular field
 *
 * @param props - The `FieldErrorProps` for the errors being rendered
 */
export default function FieldErrorTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: FieldErrorProps<T, S, F>) {
  // show-hide decision phase start ----------------
  let show = false;

  // array, object, null will produce non-error yielding widgets
  // so we need to show the errors
  if (['array', 'object', 'null'].includes(props.schema.type as string)) {
    show = true;
  }

  // but if the schema is multiple-selecting data-url, it will yield a normal input widget, which will show errors
  // so we need to hide the errors
  if (
    props.schema.type === 'array' &&
    typeof props.schema.items === 'object' &&
    !(props.schema.items instanceof Array) &&
    props.schema.items?.type === 'string' &&
    props.schema.items?.format === 'data-url'
  ) {
    show = false;
  }
  // show-hide decision phase end ----------------

  if (show === false) {
    return null;
  }

  return createErrors<T>(props.errors, false, props.idSchema);
}
