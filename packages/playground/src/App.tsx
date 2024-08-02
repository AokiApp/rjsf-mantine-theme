import { Playground } from './Playground';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';

export default function App() {
  return (
    <MantineProvider>
      <Playground />
    </MantineProvider>
  );
}
