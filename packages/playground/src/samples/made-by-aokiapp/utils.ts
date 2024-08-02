import { ObjectOptions, Type, TObject, TUnsafe } from '@sinclair/typebox';

/**
 * Return a schema of an enum whose value is a number and whose label is a string.
 * @param param - An object whose key is a number and whose value is a string.
 * @param options - Options for the schema.
 * @returns Typebox schema of an enum whose value is a number and whose label is a string.
 */
export function NamedNumberEnum<T extends Record<number, string>>(param: T, options?: ObjectOptions) {
  return Type.Unsafe<keyof T>({
    type: 'number',
    oneOf: Object.keys(param).map((key) => ({
      const: Number(key),
      title: param[Number(key)],
    })),
    ...options,
  });
}

/**
 * Return a schema of an enum whose value is a string and whose label is a string.
 * @param param - An object whose key is a string and whose value is a string.
 * @param options - Options for the schema.
 * @returns Typebox schema of an enum whose value is a string and whose label is a string.
 */
export function NamedStringEnum<T extends Record<string, string>>(param: T, options?: ObjectOptions) {
  return Type.Unsafe<keyof T>({
    type: 'string',
    oneOf: Object.keys(param).map((key) => ({
      const: key,
      title: param[key],
    })),
    ...options,
  });
}

/**
 * Return a schema of an object with an if-then-else condition.
 * @param baseProperty - Base properties of the object.
 * @param ifCondition - If condition of the object. Parameters of the condition are in the base properties.
 * @param thenProperty - Then properties of the object.
 * @param elseProperty - Else properties of the object.
 * @param options - Options for the schema.
 */

export function ObjectIfThenElse<T>(baseProperty: TObject, ifCondition: TObject, thenProperty: TObject): TUnsafe<T>;
export function ObjectIfThenElse<T>(
  baseProperty: TObject,
  ifCondition: TObject,
  thenProperty: TObject,
  elseProperty: TObject,
): TUnsafe<T>;
export function ObjectIfThenElse<T>(
  baseProperty: TObject,
  ifCondition: TObject,
  thenProperty: TObject,
  options: ObjectOptions,
): TUnsafe<T>;
export function ObjectIfThenElse<T>(
  baseProperty: TObject,
  ifCondition: TObject,
  thenProperty: TObject,
  elseProperty: TObject,
  options: ObjectOptions,
): TUnsafe<T>;

export function ObjectIfThenElse<T>(
  baseProperty: TObject,
  ifCondition: TObject,
  thenProperty: TObject,
  _elsePropertyOrObjectOptions?: TObject | ObjectOptions,
  _options?: ObjectOptions,
) {
  // normalize parameters
  let elseProperty: TObject | undefined;
  let options: ObjectOptions;

  if (_options && _elsePropertyOrObjectOptions) {
    elseProperty = _elsePropertyOrObjectOptions as TObject;
    options = _options;
  } else if (_elsePropertyOrObjectOptions) {
    if ('type' in _elsePropertyOrObjectOptions) {
      // it's a object schema
      // so the third parameter is the else property
      elseProperty = _elsePropertyOrObjectOptions as TObject;
      options = {};
    } else {
      // it's a non-schema object
      elseProperty = undefined;
      options = _elsePropertyOrObjectOptions as ObjectOptions;
    }
  } else {
    elseProperty = undefined;
    options = {};
  }

  return Type.Unsafe<T>({
    type: 'object',
    properties: {
      ...baseProperty.properties,
    },
    if: {
      ...ifCondition,
    },
    then: {
      ...thenProperty,
    },
    ...(elseProperty ? { else: { ...elseProperty } } : {}),
    required: baseProperty.required,
    ...options,
  });
}
