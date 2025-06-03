import React from 'react';
import Layout from '../layout/Layout';
import { AuthProvider } from '../contexts/authContext';

const App = () => {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
};

export default App; 