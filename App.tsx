import React from 'react';
import Layout from './Layout';
import { AuthContextProvider } from './src/contexts/authContext';

const App = () => {
  return (
    <AuthContextProvider>
      <Layout />
    </AuthContextProvider>
  );
};

export default App; 