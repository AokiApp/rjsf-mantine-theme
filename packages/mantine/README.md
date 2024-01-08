[![Build Status][build-shield]][build-url]
[![npm][npm-shield]][npm-url]
[![npm downloads][npm-dl-shield]][npm-dl-url]
[![Contributors][contributors-shield]][contributors-url]
[![Apache 2.0 License][license-shield]][license-url]

<br />
<p align="center">

  <h3 align="center">@rjsf/mantine</h3>

  <p align="center">
  Mantine theme for <a href="https://github.com/rjsf-team/react-jsonschema-form/"><code>react-jsonschema-form</code></a>.
    <br />
    <a href="https://rjsf-team.github.io/react-jsonschema-form/docs/"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://rjsf-team.github.io/react-jsonschema-form/">View Playground</a>
    ·
    <a href="https://github.com/rjsf-team/react-jsonschema-form/issues">Report Bug</a>
    ·
    <a href="https://github.com/rjsf-team/react-jsonschema-form/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Contact](#contact)

<!-- ABOUT THE PROJECT -->

## About The Project

Mantine theme for `react-jsonschema-form`.

### Built With

- [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form/)
- [Mantine UI](https://mantine.dev/)

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form/)

### Installation

For npm:

```sh
npm i @tabler/icons-react @mantine/core @mantine/hooks @rjsf/mantine
```

For yarn:

```sh
yarn add @tabler/icons-react @mantine/core @mantine/hooks @rjsf/mantine
```

For pnpm:

```sh
pnpm add @tabler/icons-react @mantine/core @mantine/hooks @rjsf/mantine
```

## Usage

```js
import Form from '@rjsf/mantine';
```

or

```js
import { withTheme } from '@rjsf/core';
import { Theme as MantineUITheme } from '@rjsf/mantine';

// Make modifications to the theme with your own fields and widgets

const Form = withTheme(MantineUITheme);
```

<!-- ROADMAP -->

## Roadmap

See the general [open issues](https://github.com/rjsf-team/react-jsonschema-form/issues).

<!-- CONTRIBUTING -->

## Contributing

Read our [contributors' guide](https://rjsf-team.github.io/react-jsonschema-form/docs/contributing/) to get started.

<!-- CONTACT -->

## Contact

rjsf team: [https://github.com/orgs/rjsf-team/people](https://github.com/orgs/rjsf-team/people)

GitHub repository: [https://github.com/rjsf-team/react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[build-shield]: https://github.com/rjsf-team/react-jsonschema-form/workflows/CI/badge.svg
[build-url]: https://github.com/rjsf-team/react-jsonschema-form/actions
[contributors-shield]: https://img.shields.io/github/contributors/rjsf-team/react-jsonschema-form.svg
[contributors-url]: https://github.com/rjsf-team/react-jsonschema-form/graphs/contributors
[license-shield]: https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square
[license-url]: https://choosealicense.com/licenses/apache-2.0/
[npm-shield]: https://img.shields.io/npm/v/@rjsf/core/latest.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@rjsf/core
[npm-dl-shield]: https://img.shields.io/npm/dm/@rjsf/core.svg?style=flat-square
[npm-dl-url]: https://www.npmjs.com/package/@rjsf/core
[product-screenshot]: https://raw.githubusercontent.com/rjsf-team/react-jsonschema-form/59a8206e148474bea854bbb004f624143fbcbac8/packages/core/screenshot.png
