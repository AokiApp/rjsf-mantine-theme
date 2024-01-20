import { Sample } from '../Sample';

const files: Sample = {
  schema: {
    title: 'Files',
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'data-url',
        title: 'Single file(max 1MB)',
        maxLength: Math.floor(1024 * 1024 * (8 / 6)), // 8/6 base64
      },
      files: {
        type: 'array',
        title: '1-3 files(max 100KB each)',
        items: {
          type: 'string',
          format: 'data-url',
          maxLength: Math.floor(100 * 1024 * (8 / 6)), // 8/6 base64
        },
        maxItems: 3,
        minItems: 1,
      },
      filesAccept: {
        type: 'string',
        format: 'data-url',
        title: 'Single File with Accept attribute',
      },
    },
  },
  uiSchema: {
    filesAccept: {
      'ui:options': {
        filePreview: true,
        accept: {
          'image/*': ['.jpg', '.jpeg', '.png'],
          'audio/*': [],
          'application/pdf': ['.pdf'],
        },
      },
    },
  },
  formData: {},
};

export default files;
