import '@/styles/globals.css';
import Head from 'next/head';
export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Simple Todo App - CRUD</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
