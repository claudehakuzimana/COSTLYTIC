import '../client/src/index.css';
import { Toaster } from 'react-hot-toast';
import CommandPalette from '../client/src/components/CommandPalette';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Toaster position="top-right" />
      <CommandPalette />
      <Component {...pageProps} />
    </>
  );
}
