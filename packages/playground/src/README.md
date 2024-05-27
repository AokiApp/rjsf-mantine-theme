# @aokiapp/rjsf-mantine-theme

This package provides a Mantine theme for the React JSON Schema Form (rjsf) library.

## Demo

We have a playgroud where you can see the theme in action:

```bash
npm install
npm run build
cd packages/playground
npm run start
```

## Installation

You can install the package:

npm:

```bash
npm install @mantine/core@7 @mantine/dates@7 @mantine/hooks@7 @rjsf/core @tabler/icons-react dayjs react
```

yarn:

```bash
yarn add @mantine/core@7 @mantine/dates@7 @mantine/hooks@7 @rjsf/core @tabler/icons-react dayjs react
```

## Usage

```js
import { MantineProvider } from '@mantine/core';
import Form from '@aokiapp/rjsf-mantine-theme';

render(
  <MantineProvider>
    <Form schema={schema} uiSchema={uiSchema} />
  </MantineProvider>,
  document.getElementById('app'),
);
```

or with a custom theme:

```js
import { withTheme } from '@rjsf/core';
import { Theme as MantineTheme } from '@aokiapp/rjsf-mantine-theme';

// Make modifications to the theme with your own fields and widgets

const Form = withTheme(MantineTheme);
```

For usage of RJSF, please refer the [official documentation](https://rjsf-team.github.io/react-jsonschema-form/docs/).

## Credits

This derivative is based on the [@pkalisiewicz's previous work](https://github.com/pkalisiewicz/react-jsonschema-form/tree/rc5.7.0).

This repository is built using [RJSF (React JSON Schema Form)](https://github.com/rjsf-team/react-jsonschema-form).

We appreciate the hard work and dedication of the RJSF team and contributors in creating and maintaining this valuable tool.

## License

Apache-2.0
