import React from 'react';
import { LocaleProvider } from '../utils/localeContext';

interface RootProps {
  children: React.ReactNode;
}

const Root: React.FC<RootProps> = ({ children }) => {
  return (
    <LocaleProvider>
      {children}
    </LocaleProvider>
  );
};

export default Root; 