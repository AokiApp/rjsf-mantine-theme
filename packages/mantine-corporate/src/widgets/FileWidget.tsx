import { createContext, useCallback, useContext, useMemo } from 'react';
import {
  dataURItoBlob,
  FormContextType,
  getTemplate,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
  descriptionId,
} from '@rjsf/utils';
import { Badge, Card, Group, Text, Image, Box, AspectRatio, CloseButton, Stack } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import '@mantine/dropzone/styles.css';
import {
  IconCode,
  IconFile,
  IconFileDigit,
  IconFileTypeTxt,
  IconFileZip,
  IconPdf,
  IconPhoto,
} from '@tabler/icons-react';

function addNameToDataURL(dataURL: string, name: string) {
  if (dataURL === null) {
    return null;
  }
  return dataURL.replace(';base64', `;name=${encodeURIComponent(name)};base64`);
}

type FileInfoType = {
  dataURL?: string | null;
  name: string;
  size: number;
  type: string;
};

function processFile(file: File): Promise<FileInfoType> {
  const { name, size, type } = file;
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        resolve({
          dataURL: addNameToDataURL(event.target.result, name),
          name,
          size,
          type,
        });
      } else {
        resolve({
          dataURL: null,
          name,
          size,
          type,
        });
      }
    };
    reader.readAsDataURL(file);
  });
}

function processFiles(files: FileWithPath[]) {
  return Promise.all(files.map(processFile));
}

const fileInfoCtx = createContext<{
  filesInfo: FileInfoType[];
  onRemove: (index: number) => void;
  preview: boolean;
}>(null!);

function FileInfoPreview({ fileInfo }: { fileInfo: FileInfoType }) {
  const { preview } = useContext(fileInfoCtx);
  const { dataURL, type, name } = fileInfo;
  if (!dataURL) {
    return null;
  }

  if (preview && type.indexOf('image') !== -1) {
    return <Image src={dataURL} alt={name} />;
  }
  let IconComponent;

  switch (type) {
    case 'application/pdf':
    case 'application/x-pdf':
      IconComponent = IconPdf;
      break;
    case 'image/svg+xml':
    case 'image/svg':
      IconComponent = IconFile;
      break;
    case 'image/png':
    case 'image/jpeg':
    case 'image/gif':
    case 'image/bmp':
      IconComponent = IconPhoto;
      break;
    case 'application/zip':
    case 'application/x-zip-compressed':
    case 'application/x-gzip':
    case 'application/x-tar':
    case 'application/x-bzip':
    case 'application/x-bzip2':
    case 'application/x-7z-compressed':
    case 'application/x-rar-compressed':
      IconComponent = IconFileZip;
      break;
    case 'text/plain':
      IconComponent = IconFileTypeTxt;
      break;
    case 'text/html':
    case 'application/xhtml+xml':
    case 'application/xml':
    case 'application/json':
    case 'application/javascript':
      IconComponent = IconCode;
      break;
    case 'application/octet-stream':
      IconComponent = IconFileDigit;
      break;
    default:
      IconComponent = IconFile;
      break;
  }

  return (
    <Box
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <IconComponent size={30} />
      <Badge variant='outline'>{type}</Badge>
    </Box>
  );
}

function convertUnitPrefix(size: number) {
  const prefixes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, index)).toFixed(2)} ${prefixes[index]}`;
}
function FilesInfo() {
  const { filesInfo, onRemove } = useContext(fileInfoCtx);

  if (filesInfo.length === 0) {
    return null;
  }
  return (
    <Group m={'sm'}>
      {filesInfo.map((fileInfo, key) => {
        const { name, size } = fileInfo;
        const rmFile = () => onRemove(key);
        return (
          <Card key={key} shadow='sm' padding='xs' radius='md' w={200} withBorder>
            <Card.Section>
              <AspectRatio ratio={2} maw={240} mx='auto'>
                <FileInfoPreview fileInfo={fileInfo} />
              </AspectRatio>
            </Card.Section>
            <Text fw={600} truncate='end'>
              {name}
            </Text>
            <Group gap='xs' justify='space-between'>
              <Badge color='blue' variant='light'>
                {convertUnitPrefix(size)}
              </Badge>
              <CloseButton onClick={rmFile} />
            </Group>
          </Card>
        );
      })}
    </Group>
  );
}

function extractFileInfo(dataURLs: string[]): FileInfoType[] {
  return dataURLs
    .filter((dataURL) => dataURL)
    .map((dataURL) => {
      const { blob, name } = dataURItoBlob(dataURL);
      return {
        dataURL,
        name: name,
        size: blob.size,
        type: blob.type,
      };
    });
}

/**
 *  The `FileWidget` is a widget for rendering file upload fields.
 *  It is typically used with a string property with data-url format.
 */
function FileWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>,
) {
  const { disabled, readonly, required, multiple, onChange, value, options, registry, schema, hideLabel, label, id } =
    props;
  const TitleFieldTemplate = getTemplate<'TitleFieldTemplate', T, S, F>('TitleFieldTemplate', registry, options);
  const DescriptionFieldTemplate = getTemplate<'DescriptionFieldTemplate', T, S, F>(
    'DescriptionFieldTemplate',
    registry,
    options,
  );

  const handleChange = useCallback(
    (files: FileWithPath[]) => {
      if (!files || files.length === 0) {
        return;
      }
      // Due to variances in themes, dealing with multiple files for the array case now happens one file at a time.
      // This is because we don't pass `multiple` into the `BaseInputTemplate` anymore. Instead, we deal with the single
      // file in each event and concatenate them together ourselves
      processFiles(files).then((filesInfoEvent) => {
        const newValue = filesInfoEvent.map((fileInfo) => fileInfo.dataURL);
        if (multiple) {
          // filter out null, somewhat null is contained
          onChange(value.filter((e: any) => !!e).concat(newValue[0]));
        } else {
          onChange(newValue[0]);
        }
      });
    },
    [multiple, value, onChange],
  );

  const filesInfo = useMemo(() => extractFileInfo(Array.isArray(value) ? value : [value]), [value]);
  const rmFile = useCallback(
    (index: number) => {
      if (multiple) {
        const newValue = value.filter((_: any, i: number) => i !== index);
        onChange(newValue);
      } else {
        onChange(undefined);
      }
    },
    [multiple, value, onChange],
  );

  // accept is not string[] and Record<string, string[]
  let accept = options.accept ?? undefined;

  // accept must be string[] or Record<string, string[]>
  // if not, it will be error
  if (accept && !Array.isArray(accept) && typeof accept !== 'object') {
    console.warn('accept must be string[] or Record<string, string[]>. ignoring...');
    accept = undefined;
  }
  const description = options.description || schema.description;
  return (
    <div>
      <fileInfoCtx.Provider value={{ filesInfo, onRemove: rmFile, preview: options.filePreview ?? true }}>
        {label && !hideLabel && (
          <TitleFieldTemplate id={id} title={label} required={required} schema={schema} registry={registry} />
        )}
        {description && !hideLabel && (
          <DescriptionFieldTemplate
            id={descriptionId<T>(id)}
            description={props.description}
            registry={registry}
            schema={schema}
          />
        )}
        <Dropzone
          accept={accept as string[] | Record<string, string[]>}
          onDrop={handleChange}
          disabled={disabled || readonly}
          maxSize={
            // @ts-expect-error strict type check rarely need for this easy case, as long as the schema is correct
            options.maxSize || schema.maxLength || schema.items?.maxLength
          }
          multiple={multiple}
        >
          <Stack gap='0' align='center'>
            <Text size='xl' fw={700}>
              ファイルをドロップしてください
            </Text>
            <Text size='sm'>または、ファイルを選択する</Text>
          </Stack>
        </Dropzone>
        <FilesInfo />
      </fileInfoCtx.Provider>
    </div>
  );
}

export default FileWidget;
