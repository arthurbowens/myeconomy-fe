import React from 'react';
import Layout from './Layout';
import { AuthProvider } from './src/contexts/authContext';

const App = () => {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
};

export default App;