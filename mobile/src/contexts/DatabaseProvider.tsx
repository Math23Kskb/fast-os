import React, { createContext, useContext, ReactNode } from 'react';
import { database } from '../db';

const DatabaseContext = createContext(database);

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  return (
    <DatabaseContext.Provider value={database}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);
