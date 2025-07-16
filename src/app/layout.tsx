'use client'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import './globals.css';
import { Roboto } from 'next/font/google';
import { CssBaseline } from '@mui/material';
import Navbar from './_Components/Navbar/Navbar';
import { myStore } from '@/lib/redux/reduxStore';
import { Provider } from 'react-redux';

const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ['latin'], variable: '--font-roboto',
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <CssBaseline />
        <Provider store={myStore}>
          <Navbar />
          <ToastContainer position="top-right" autoClose={3000} />
          {children}
        </Provider>
      </body>
    </html>
  );
}
