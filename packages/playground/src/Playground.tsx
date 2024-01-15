import { Grid, Group, Select, Stack, Switch, Textarea, Title } from '@mantine/core';
import { IChangeEvent } from '@rjsf/core';
import MantineForm from '@aokiapp/rjsf-mantine-theme';
import MantineCorporateForm from '@aokiapp/rjsf-mantine-corporate';
import CoreForm from '@rjsf/core';
import validator from '@rjsf/validator-ajv6';
import { useEffect, useState } from 'react';
import { samples } from './samples';
import { Sample } from './samples/Sample';
import GeoPosition from './samples/components/GeoPosition';
import SpecialInput from './samples/components/SpecialInput';

export function Playground() {
  // JSON Schema area start
  // textarea->schemaStr->(filter unparsed)->schemaSnapshot->Form
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
  const jsonSchemaForm = (
    <Textarea
      label='JSON Schema'
      onChange={(e) => setSchemaStr(e.currentTarget.value)}
      value={schemaStr}
      autosize
      error={schemaFailed ? 'Invalid JSON' : false}
      maxRows={20}
    />
  );
  // JSON Schema area end

  // UI Schema area start
  // textarea->uiSchemaStr->(filter unparsed)->uiSchemaSnapshot->Form
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
  const uiSchemaForm = (
    <Textarea
      label='UI Schema'
      onChange={(e) => setUiSchemaStr(e.currentTarget.value)}
      value={uiSchemaStr}
      autosize
      error={uiSchemaFailed ? 'Invalid JSON' : false}
      maxRows={20}
    />
  );
  // UI Schema area end

  // Form data area start
  // textarea->formDataStr->(filter unparsed)->formDataSnapshot->
  // Form->(onChange)->formDataStr->textarea->formDataStr->(always parsed)
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
  const formData = (
    <Textarea
      label='Form Data'
      onChange={(e) => setFormDataStr(e.currentTarget.value)}
      value={formDataStr}
      autosize
      error={formDataFailed ? 'Invalid JSON' : false}
      maxRows={20}
    />
  );
  // Form data area end

  // Preset area start
  const [presetPropValue, setPresetPropValue] = useState<{
    key: string;
    value: Sample;
  } | null>(null);
  const data = Object.keys(samples).map((key) => ({
    value: key,
    label: key,
  }));
  const changeHdl = (e: string | null) => {
    if (e === null) {
      return;
    }
    const sample = samples[e];
    setPresetPropValue({
      key: e,
      value: sample,
    });

    setSchemaStr(JSON.stringify(sample.schema, null, 2));
    setUiSchemaStr(JSON.stringify(sample.uiSchema, null, 2));
    setFormDataStr(JSON.stringify(sample.formData, null, 2));
  };

  const preset = (
    <Select
      label='Preset'
      description='Select here to insert'
      data={data}
      value={presetPropValue?.key}
      onChange={changeHdl}
      allowDeselect
      style={{ flexGrow: 1 }}
      searchable
    />
  );
  // Preset area end

  // Theme area start
  const [theme, setTheme] = useState('MantineCorporate');

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

  const themeSelect = (
    <Select label='Select theme' data={themes} value={theme} onChange={(value) => setTheme(value || 'Mantine')} />
  );
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

  // Form area start
  const synthesizedProps = {
    ...presetPropValue?.value,
    schema: schemaSnapshot,
    uiSchema: uiSchemaSnapshot,
    formData: formDataSnapshot,
  };
  const formRendered = (
    <FormToUse
      {...synthesizedProps}
      noHtml5Validate={noHtml5Validate}
      liveValidate={liveValidate}
      onChange={(e: IChangeEvent) => {
        setFormDataStr(JSON.stringify(e.formData, null, 2));
      }}
      fields={{
        geo: GeoPosition,
        '/schemas/specialString': SpecialInput,
      }}
      validator={validator}
    />
  );
  // Form area end
  return (
    <Stack>
      <Title>react-jsonschema-form x Mantine Playground</Title>
      <Group>
        {preset}

        {themeSelect}
        <Stack>
          {html5ValidationChk}
          {liveValidationChk}
        </Stack>
      </Group>
      <Grid>
        <Grid.Col span={6}>
          <Stack>
            <Grid>
              <Grid.Col span={6}>{jsonSchemaForm}</Grid.Col>
              <Grid.Col span={6}>{uiSchemaForm}</Grid.Col>
            </Grid>
            {formData}
          </Stack>
        </Grid.Col>
        <Grid.Col span={6}>{formRendered}</Grid.Col>
      </Grid>
    </Stack>
  );
}
