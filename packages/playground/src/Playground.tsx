import { Grid, Group, Select, Stack, Switch, JsonInput, Title, Box, Slider } from '@mantine/core';
import { IChangeEvent } from '@rjsf/core';
import MantineForm from '@aokiapp/rjsf-mantine-theme';
import MantineCorporateForm from '@aokiapp/rjsf-mantine-corporate';
import CoreForm from '@rjsf/core';
import validator from '@rjsf/validator-ajv6';
import { useEffect, useMemo, useState } from 'react';
import { samples } from './samples';
import { Sample } from './samples/Sample';
import GeoPosition from './samples/made-by-rjsf-team/components/GeoPosition';
import SpecialInput from './samples/made-by-rjsf-team/components/SpecialInput';

export function Playground() {
  // JSON Schema area start
  // JsonInput->schemaStr->(filter unparsed)->schemaSnapshot->Form
  const [schemaSnapshot, setSchemaSnapshot] = useState({});
  const [schemaStr, setSchemaStr] = useState(() => JSON.stringify(schemaSnapshot, null, 2));
  const [schemaFailed, setSchemaFailed] = useState(false);
  useEffect(() => {
    setSchemaFailed(false);
    try {
      setSchemaSnapshot(JSON.parse(schemaStr));
    } catch (e) {
      setSchemaFailed(true);
    }
  }, [schemaStr]);
  const jsonSchemaForm = useMemo(
    () => (
      <JsonInput
        formatOnBlur
        label='JSON Schema'
        onChange={(e) => setSchemaStr(e || '{}')}
        value={schemaStr}
        autosize
        error={schemaFailed ? 'Invalid JSON' : false}
        maxRows={20}
      />
    ),
    [schemaStr, schemaFailed]
  );
  // JSON Schema area end

  // UI Schema area start
  // JsonInput->uiSchemaStr->(filter unparsed)->uiSchemaSnapshot->Form
  const [uiSchemaSnapshot, setUiSchemaSnapshot] = useState({});
  const [uiSchemaStr, setUiSchemaStr] = useState(() => JSON.stringify(uiSchemaSnapshot, null, 2));
  const [uiSchemaFailed, setUiSchemaFailed] = useState(false);
  useEffect(() => {
    setUiSchemaFailed(false);
    try {
      setUiSchemaSnapshot(JSON.parse(uiSchemaStr));
    } catch (e) {
      setUiSchemaFailed(true);
    }
  }, [uiSchemaStr]);

  const uiSchemaForm = useMemo(
    () => (
      <JsonInput
        formatOnBlur
        label='UI Schema'
        onChange={(e) => setUiSchemaStr(e || '{}')}
        value={uiSchemaStr}
        autosize
        error={uiSchemaFailed ? 'Invalid JSON' : false}
        maxRows={20}
      />
    ),
    [uiSchemaStr, uiSchemaFailed]
  );
  // UI Schema area end

  // Form data area start
  // JsonInput->formDataStr->(filter unparsed)->formDataSnapshot->
  // Form->(onChange)->formDataStr->JsonInput->formDataStr->(always parsed)
  // ->formDataSnapshot->loop
  const [formDataSnapshot, setFormDataSnapshot] = useState({});
  const [formDataStr, setFormDataStr] = useState(() => JSON.stringify(formDataSnapshot, null, 2));
  const [formDataFailed, setFormDataFailed] = useState(false);
  useEffect(() => {
    setFormDataFailed(false);
    try {
      setFormDataSnapshot(JSON.parse(formDataStr));
    } catch (e) {
      setFormDataFailed(true);
    }
  }, [formDataStr]);
  const formData = useMemo(
    () => (
      <JsonInput
        formatOnBlur
        label='Form Data'
        onChange={(e) => setFormDataStr(e || '{}')}
        value={formDataStr}
        autosize
        error={formDataFailed ? 'Invalid JSON' : false}
        maxRows={20}
      />
    ),
    [formDataStr, formDataFailed]
  );
  // Form data area end

  // Preset area start
  const sampleList: Sample[] = [];
  const sectionList = Object.keys(samples).map((key) => {
    return {
      group: key,
      items: Object.keys(samples[key as keyof typeof samples]).map((k) => {
        sampleList.push(samples[key as keyof typeof samples][k]);
        return {
          value: (sampleList.length - 1).toString(),
          label: k,
        };
      }),
    };
  });

  const [presetQueryKey, setPresetQueryKey] = useState<string | null>(
    new URLSearchParams(window.location.search).get('preset')
  );
  useEffect(() => {
    setPresetQueryKey(new URLSearchParams(window.location.search).get('preset'));
  }, [window.location.search]);
  const selectedSample = presetQueryKey ? sampleList[parseInt(presetQueryKey)] : sampleList[0];
  useEffect(() => {
    setSchemaStr(JSON.stringify(selectedSample.schema, null, 2));
    setUiSchemaStr(JSON.stringify(selectedSample.uiSchema, null, 2));
    setFormDataStr(JSON.stringify(selectedSample.formData, null, 2));
  }, [selectedSample]);
  const presetChangeHdl = (e: string | null) => {
    if (e === null) {
      return;
    }
    // update the query string
    const url = new URL(window.location.href);
    url.searchParams.set('preset', e);
    window.history.pushState({}, '', url.toString());
    setPresetQueryKey(e);
  };

  const preset = (
    <Select
      label='Preset'
      description='Select here to insert'
      data={sectionList}
      value={presetQueryKey}
      onChange={presetChangeHdl}
      allowDeselect
      style={{ flexGrow: 1 }}
      searchable
      maxDropdownHeight={1000}
    />
  );
  // Preset area end

  // Theme area start
  const [theme, setTheme] = useState<string | null>(
    new URLSearchParams(window.location.search).get('theme') || 'Mantine Corporate'
  );
  useEffect(() => {
    setTheme(new URLSearchParams(window.location.search).get('theme'));
  }, [window.location.search]);
  const themes = [
    { value: 'Mantine', label: 'Mantine' },
    { value: 'MantineCorporate', label: 'Mantine Corporate' },
    { value: 'Core', label: 'Core' },
    // Add more themes here
  ];

  let FormToUse;
  switch (theme) {
    case 'Core':
      FormToUse = CoreForm;
      break;
    case 'MantineCorporate':
      FormToUse = MantineCorporateForm;
      break;
    case 'Mantine':
    default:
      FormToUse = MantineForm;
      break;
  }
  const themeChangeHdl = (e: string | null) => {
    if (e === null) {
      return;
    }
    // update the query string
    const url = new URL(window.location.href);
    url.searchParams.set('theme', e);
    window.history.pushState({}, '', url.toString());
    setTheme(e);
  };
  const themeSelect = <Select label='Select theme' data={themes} value={theme} onChange={themeChangeHdl} />;
  // Theme area end

  // Validation mode area start
  const [noHtml5Validate, setNoHtml5Validate] = useState(false);
  const html5ValidationChk = (
    <Switch
      label='Disable HTML5 validation'
      checked={noHtml5Validate}
      onChange={(e) => setNoHtml5Validate(e.currentTarget.checked)}
    />
  );

  const [liveValidate, setLiveValidate] = useState(false);
  const liveValidationChk = (
    <Switch label='Live validation' checked={liveValidate} onChange={(e) => setLiveValidate(e.currentTarget.checked)} />
  );
  // Validation mode area end

  // right pane start
  const synthesizedProps = {
    ...selectedSample,
    schema: schemaSnapshot,
    uiSchema: uiSchemaSnapshot,
    formData: formDataSnapshot,
    fields: {
      geo: GeoPosition,
      '/schemas/specialString': SpecialInput,
      ...selectedSample.fields,
    },
  };
  const rightPane = (
    <Stack>
      <Box p={'sm'}>{selectedSample.description}</Box>
      <FormToUse
        {...synthesizedProps}
        noHtml5Validate={noHtml5Validate}
        liveValidate={liveValidate}
        onChange={(e: IChangeEvent) => {
          setFormDataStr(JSON.stringify(e.formData, null, 2));
        }}
        validator={validator}
        transformErrors={(errors) => {
          console.debug('validation result', errors);
          return errors;
        }}
      />
    </Stack>
  );
  // right pane end

  // left pane start
  const [size, setSize] = useState<number>(1);
  const sizeSlider = <Slider min={0} max={2} step={1} value={size} onChange={(e) => setSize(e)} />;
  const leftPane = (
    <Stack>
      <Grid>
        <Grid.Col span={6}>{jsonSchemaForm}</Grid.Col>
        <Grid.Col span={6}>{uiSchemaForm}</Grid.Col>
      </Grid>
      {formData}
    </Stack>
  );
  // left pane end
  return (
    <Stack>
      <Title>react-jsonschema-form x Mantine Playground</Title>
      <Group>
        {preset}

        {themeSelect}
        <Stack>
          {html5ValidationChk}
          {liveValidationChk}
          {sizeSlider}
        </Stack>
      </Group>
      {size === 0 ? (
        <>{leftPane}</>
      ) : size === 2 ? (
        <>{rightPane}</>
      ) : (
        <Grid>
          <Grid.Col span={6}>{leftPane}</Grid.Col>
          <Grid.Col span={6}>{rightPane}</Grid.Col>
        </Grid>
      )}
    </Stack>
  );
}
