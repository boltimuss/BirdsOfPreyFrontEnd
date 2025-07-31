  import React, { createContext } from 'react';
  
  export const GameStateCtx = createContext({
    aircraftStates: new Map(),
    currentAircraftId: "current"
  });