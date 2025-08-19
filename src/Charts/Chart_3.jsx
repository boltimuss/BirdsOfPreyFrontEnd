import React, { useRef, useEffect, useContext } from 'react';
import { Chart3 } from '../Nomograph/Charts/Chart3.ts';
import { Rectangle2D } from '../Nomograph/SupportObjects/Rectangle2D.ts';
import { GameStateCtx } from '../GameState.jsx';

function Chart_3() {

  const canvasRef = useRef(null); 
  const chart3 = useRef(null);
  const { gameState, setGameState } = useContext(GameStateCtx);
  const { aircraftStates, currentAircraftId } = gameState;
  const keas = (aircraftStates && aircraftStates.get(currentAircraftId)) ? aircraftStates.get(currentAircraftId)["KEAS"] : 0;

  useEffect(() => {
    draw();
    canvasRef.current.addEventListener('mousemove', handleMouseMove);
    canvasRef.current.addEventListener('mousedown', handleMouseDown);
    canvasRef.current.addEventListener('mouseup', handleMouseUp);
  }, [keas]);  

  const handleMouseDown = (event) => {
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    chart3.current.handleMouseDown(x, y);
  };

  const handleMouseMove = (event) => {
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    chart3.current.handleMouseMove(x, y);
    if (!chart3.current.isDragging) return;
      setGameState(prev => {

      if (prev &&  chart3.current.gameState) {
        const newAircraftStates = new Map(prev.aircraftStates);
        newAircraftStates.set(chart3.current.gameState.currentAircraftId, chart3.current.gameState.aircraftStates.get(chart3.current.gameState.currentAircraftId));
        return { ...prev, currentAircraftId: chart3.current.gameState.currentAircraftId, aircraftStates: newAircraftStates };
      }
      else if (chart3.current.gameState)
      {
        const newAircraftStates = new Map();
        newAircraftStates.set(chart3.current.gameState.currentAircraftId, chart3.current.gameState.aircraftStates.get(chart3.current.gameState.currentAircraftId));
        return {currentAircraftId: chart3.current.gameState.currentAircraftId, aircraftStates: newAircraftStates};
      }
    });
  };

  const handleMouseUp = (event) => {
    
    const rect =  canvasRef.current.getBoundingClientRect();
    const scaleX =  canvasRef.current.width / rect.width;
    const scaleY =  canvasRef.current.height / rect.height;

    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    chart3.current.handleMouseUp(x, y);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (canvas && chart3.current == null) {
      const ctx = canvas.getContext('2d');
      chart3.current = new Chart3(new Rectangle2D(0, 0, 900, 900), ctx, gameState);
      chart3.current.init();
    }
    else if (chart3.current)
    {
      chart3.current.gameState = gameState;
      chart3.current.execute();
      setGameState(prev => {

        if (prev &&  chart3.current.gameState) {
          const newAircraftStates = new Map(prev.aircraftStates);
          newAircraftStates.set(chart3.current.gameState.currentAircraftId, chart3.current.gameState.aircraftStates.get(chart3.current.gameState.currentAircraftId));
          return { ...prev, currentAircraftId: chart3.current.gameState.currentAircraftId, aircraftStates: newAircraftStates };
        }
        else if (chart3.current.gameState)
          {
          const newAircraftStates = new Map();
          newAircraftStates.set(chart3.current.gameState.currentAircraftId, chart3.current.gameState.aircraftStates.get(chart3.current.gameState.currentAircraftId));
          return {currentAircraftId: chart3.current.gameState.currentAircraftId, aircraftStates: newAircraftStates};
        }
      });
    }
  };

  return (
    <>
      <canvas ref={canvasRef} width={900} height={900} />
    </>
  );
}

export default Chart_3