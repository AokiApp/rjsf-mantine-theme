import { Sample } from '../Sample';
import ObjectFieldTemplate from '../../../../mantine-corporate/src/templates/ObjectFieldTemplate';

const example: Sample = {
  schema: {
    title: 'Core schema meta-schema',
    definitions: {
      schemaArray: {
        type: 'array',
        minItems: 1,
        items: { $ref: '#/definitions/rootSchema' },
      },
      nonNegativeInteger: {
        type: 'integer',
        minimum: 0,
      },
      nonNegativeIntegerDefault0: {
        allOf: [{ $ref: '#/definitions/nonNegativeInteger' }, { default: 0 }],
      },
      simpleTypes: {
        enum: ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'],
      },
      stringArray: {
        type: 'array',
        items: { type: 'string' },
        uniqueItems: true,
        default: [],
      },
      rootSchema: {
        oneOf: [
          { const: null, title: 'default null' },
          { $ref: '#/definitions/_rootSchema', title: 'danger schema' },
        ],
        default: null,
      },
      _rootSchema: {
        type: 'object',
        properties: {
          $comment: {
            type: 'string',
          },
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          default: true,
          readOnly: {
            type: 'boolean',
            default: false,
          },
          writeOnly: {
            type: 'boolean',
            default: false,
          },
          examples: {
            type: 'array',
            items: {
              type: ['object', 'array', 'number', 'boolean', 'string', 'null'],
              default: true,
            },
          },
          multipleOf: {
            type: 'number',
            exclusiveMinimum: 0,
          },
          maximum: {
            type: 'number',
          },
          exclusiveMaximum: {
            type: 'number',
          },
          minimum: {
            type: 'number',
          },
          exclusiveMinimum: {
            type: 'number',
          },
          maxLength: { $ref: '#/definitions/nonNegativeInteger' },
          minLength: { $ref: '#/definitions/nonNegativeIntegerDefault0' },
          pattern: {
            type: 'string',
            format: 'regex',
          },
          additionalItems: { $ref: '#/definitions/rootSchema' },
          items: {
            anyOf: [{ $ref: '#/definitions/rootSchema' }, { $ref: '#/definitions/schemaArray' }],
          },
          maxItems: { $ref: '#/definitions/nonNegativeInteger' },
          minItems: { $ref: '#/definitions/nonNegativeIntegerDefault0' },
          uniqueItems: {
            type: 'boolean',
            default: false,
          },
          contains: { $ref: '#/definitions/rootSchema' },
          maxProperties: { $ref: '#/definitions/nonNegativeInteger' },
          minProperties: { $ref: '#/definitions/nonNegativeIntegerDefault0' },
          required: { $ref: '#/definitions/stringArray' },
          additionalProperties: { $ref: '#/definitions/rootSchema' },
          definitions: {
            type: 'object',
            additionalProperties: { $ref: '#/definitions/rootSchema' },
          },
          properties: {
            type: 'object',
            additionalProperties: { $ref: '#/definitions/rootSchema' },
          },
          patternProperties: {
            type: 'object',
            additionalProperties: { $ref: '#/definitions/rootSchema' },
            propertyNames: { format: 'regex' },
          },
          dependencies: {
            type: 'object',
            additionalProperties: {
              anyOf: [{ $ref: '#/definitions/rootSchema' }, { $ref: '#/definitions/stringArray' }],
            },
          },
          propertyNames: { $ref: '#/definitions/rootSchema' },
          const: true,
          enum: {
            type: 'array',
            items: {
              type: ['string', 'number', 'boolean', 'null', 'object'],
              default: null,
            },

            minItems: 1,
            uniqueItems: true,
          },
          type: {
            anyOf: [
              { $ref: '#/definitions/simpleTypes' },
              {
                type: 'array',
                items: { $ref: '#/definitions/simpleTypes' },
                minItems: 1,
                uniqueItems: true,
              },
            ],
          },
          format: { type: 'string' },
          contentMediaType: { type: 'string' },
          contentEncoding: { type: 'string' },
          if: { $ref: '#/definitions/rootSchema' },
          then: { $ref: '#/definitions/rootSchema' },
          else: { $ref: '#/definitions/rootSchema' },
          allOf: { $ref: '#/definitions/schemaArray' },
          anyOf: { $ref: '#/definitions/schemaArray' },
          oneOf: { $ref: '#/definitions/schemaArray' },
          not: { $ref: '#/definitions/rootSchema' },
        },
      },
    },
    $ref: '#/definitions/rootSchema',
    default: null,
  },
  uiSchema: {},
  formData: {
    type: 'null',
  },
  templates: {
    ObjectFieldTemplate: (args: any) => {
      if (args.schema.title === 'danger schema' && cnt++ > 10) {
        return null;
      }
      return ObjectFieldTemplate(args);
    },
  },
};
let cnt = 0;
window.reset = (c = 0) => {
  cnt = c;
};
export default example;
