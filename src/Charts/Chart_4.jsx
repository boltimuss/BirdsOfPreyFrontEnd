/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useContext } from 'react';
import { Chart4 } from '../Nomograph/Charts/Chart4.ts';
import { Rectangle2D } from '../Nomograph/SupportObjects/Rectangle2D.ts';
import { GameStateCtx } from '../GameState.jsx'

function Chart_4() {

  const canvasRef = useRef(null);
  const chart4 = useRef(null);
  const { gameState, setGameState } = useContext(GameStateCtx);
  const { aircraftStates, currentAircraftId } = gameState;
  const qPoint = (aircraftStates && aircraftStates.get(currentAircraftId)) ? aircraftStates.get(currentAircraftId)["q-point"] : 0;

    useEffect(() => {
      
      const canvas = canvasRef.current;
      if (canvas && chart4.current == null) {
        const ctx = canvas.getContext('2d');
        chart4.current = new Chart4(new Rectangle2D(0, 0, 900, 900), ctx, gameState);
        chart4.current.init();
      }
      if (!qPoint) return;
      draw();
      canvasRef.current.addEventListener('mousemove', handleMouseMove);
      canvasRef.current.addEventListener('mousedown', handleMouseDown);
      canvasRef.current.addEventListener('mouseup', handleMouseUp);
    }, [qPoint]);  

  const draw = () => {
      if (chart4.current && qPoint)
      {
        chart4.current.gameState = gameState;
        chart4.current.execute();
      }
    };

  const handleMouseDown = (event) => {
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    chart4.current.gameState = gameState;
    chart4.current.handleMouseDown(x, y);

  };

  const handleMouseMove = (event) => {
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    chart4.current.handleMouseMove(x, y);
    if (!chart4.current.isDragging) return;
      setGameState(prev => {

      if (prev  &&  chart4.current.gameState) {
        const newAircraftStates = new Map(prev.aircraftStates);
        newAircraftStates.set(chart4.current.gameState.currentAircraftId, chart4.current.gameState.aircraftStates.get(chart4.current.gameState.currentAircraftId));
        return { ...prev, currentAircraftId: chart4.current.gameState.currentAircraftId, aircraftStates: newAircraftStates };
      }
      else if (chart4.current.gameState)
      {
        const newAircraftStates = new Map();
        newAircraftStates.set(chart4.current.gameState.currentAircraftId, chart4.current.gameState.aircraftStates.get(chart4.current.gameState.currentAircraftId));
        return {currentAircraftId: chart4.current.gameState.currentAircraftId, aircraftStates: newAircraftStates};
      }
    });
  };

  const handleMouseUp = (event) => {
    
    const rect =  canvasRef.current.getBoundingClientRect();
    const scaleX =  canvasRef.current.width / rect.width;
    const scaleY =  canvasRef.current.height / rect.height;

    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    chart4.current.handleMouseUp(x, y);
  };

  return (
    <>
      <canvas ref={canvasRef} width={900} height={900} />
    </>
  );
}

export default Chart_4