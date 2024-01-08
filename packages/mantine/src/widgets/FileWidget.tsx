import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { dataURItoBlob, FormContextType, getTemplate, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { Badge, Card, Group, Text, Image, Box, AspectRatio, CloseButton } from '@mantine/core';
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

function processFiles(files: FileList) {
  return Promise.all(Array.from(files).map(processFile));
}

const fileInfoCtx = createContext<{
  filesInfo: FileInfoType[];
  set: Dispatch<SetStateAction<FileInfoType[]>>;
  preview: boolean;
  onChange?: (value: any) => void;
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
      }}
    >
      <IconComponent size={30} />
    </Box>
  );
}

function convertUnitPrefix(size: number) {
  const prefixes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, index)).toFixed(2)} ${prefixes[index]}`;
}
function FilesInfo() {
  const { filesInfo, set, onChange } = useContext(fileInfoCtx);

  if (filesInfo.length === 0) {
    return null;
  }
  return (
    <Group m={'sm'}>
      {filesInfo.map((fileInfo, key) => {
        const { name, size } = fileInfo;
        const rmFile = () => {
          const newFilesInfo = [...filesInfo];
          newFilesInfo.splice(key, 1);
          set(newFilesInfo);
        };
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
  props: WidgetProps<T, S, F>
) {
  const { disabled, readonly, required, multiple, onChange, value, options, registry } = props;
  const BaseInputTemplate = getTemplate<'BaseInputTemplate', T, S, F>('BaseInputTemplate', registry, options);
  const [filesInfo, setFilesInfo] = useState<FileInfoType[]>(() =>
    Array.isArray(value) ? extractFileInfo(value) : extractFileInfo([value])
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) {
        return;
      }
      // Due to variances in themes, dealing with multiple files for the array case now happens one file at a time.
      // This is because we don't pass `multiple` into the `BaseInputTemplate` anymore. Instead, we deal with the single
      // file in each event and concatenate them together ourselves
      processFiles(event.target.files).then((filesInfoEvent) => {
        if (multiple) {
          setFilesInfo(filesInfo.concat(filesInfoEvent[0]));
        } else {
          setFilesInfo(filesInfoEvent);
        }
      });
    },
    [multiple, filesInfo]
  );

  useEffect(() => {
    // reacts the change of filesInfo
    if (multiple) {
      onChange(filesInfo.map((fileInfo) => fileInfo.dataURL));
    } else {
      onChange(filesInfo[0]?.dataURL);
    }
  }, [filesInfo, multiple, onChange]);

  return (
    <div>
      <BaseInputTemplate
        {...props}
        disabled={disabled || readonly}
        type='file'
        required={value ? false : required} // this turns off HTML required validation when a value exists
        onChangeOverride={handleChange}
        value=''
        accept={options.accept ? String(options.accept) : undefined}
      />
      <fileInfoCtx.Provider
        value={{
          filesInfo,
          set: setFilesInfo,
          preview: options.filePreview ?? false,
          onChange,
        }}
      >
        <FilesInfo />
      </fileInfoCtx.Provider>
    </div>
  );
}

export default FileWidget;
