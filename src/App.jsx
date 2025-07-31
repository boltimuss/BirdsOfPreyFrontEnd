import './App.css'
import Chart_1 from './Charts/Chart_1.jsx'
import Chart_2 from './Charts/Chart_2.jsx'
import Chart_3 from './Charts/Chart_3.jsx'
import Chart_4 from './Charts/Chart_4.jsx'
import { GameStateCtx } from './GameState.jsx'
import { useState } from 'react'

function App() {
  
  const [gameState, setGameState] = useState({aircraftStates: new Map([]), currentAircraftId: "current"});
  
  return (
    <>
    <GameStateCtx.Provider value={{gameState, setGameState}}>
      <div style={{ display: 'flex', flexWrap: 'wrap'}}>
        <div style={{ width: '450px', height: '450px' }}><Chart_1></Chart_1></div>
        <div style={{ width: '450px', height: '450px' }}><Chart_2></Chart_2></div>
        <div style={{ width: '625px', height: '700px' }}><Chart_3></Chart_3></div>
        <div style={{ width: '625px', height: '700px' }}><Chart_4></Chart_4></div>
      </div>
    </GameStateCtx.Provider>
    </>
  );

  }

export default App