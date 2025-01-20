import React, { createContext, useState } from 'react';

// Creating the context
export const CaptainDataContext = createContext();

// Create a provider component for this context
export const CaptainDataProvider = ({ children }) => {
  const [captain, setCaptain] = useState(null); // initialize captain state

  return (
    <CaptainDataContext.Provider value={{ captain, setCaptain }}>
      {children}
    </CaptainDataContext.Provider>
  );
};
