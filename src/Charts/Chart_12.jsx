/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useContext } from 'react';
import { Chart12 } from '../Nomograph/Charts/Chart12.ts';
import { Rectangle2D } from '../Nomograph/SupportObjects/Rectangle2D.ts';
import { GameStateCtx } from '../GameState.jsx'

function Chart_12() {

  const canvasRef = useRef(null);
  const chart12 = useRef(null);
  const { gameState, setGameState } = useContext(GameStateCtx);
  const { aircraftStates, currentAircraftId } = gameState;
  const wingload = (aircraftStates && aircraftStates.get(currentAircraftId)) ? aircraftStates.get(currentAircraftId)["wingload"] : 0;

     useEffect(() => {
       
      const canvas = canvasRef.current;
      if (canvas && chart12.current == null) {
        const ctx = canvas.getContext('2d');
        chart12.current = new Chart12(new Rectangle2D(0, 0, 900, 900), ctx, gameState);
        chart12.current.init();
      }

       if (!wingload) return;
       draw();
       canvasRef.current.addEventListener('mousemove', handleMouseMove);
       canvasRef.current.addEventListener('mousedown', handleMouseDown);
       canvasRef.current.addEventListener('mouseup', handleMouseUp);
     }, [wingload]); 
    
  const draw = () => {
      if (chart12.current && wingload)
      {
        chart12.current.gameState = gameState;
        chart12.current.execute();
      }
    };

  const handleMouseDown = (event) => {
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    chart12.current.gameState = gameState;
    chart12.current.handleMouseDown(x, y);
  };

  const handleMouseMove = (event) => {
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    chart12.current.handleMouseMove(x, y);
    
    setGameState(prev => {

      if (prev &&  chart12.current.gameState) {
        const newAircraftStates = new Map(prev.aircraftStates);
        newAircraftStates.set(chart12.current.gameState.currentAircraftId, chart12.current.gameState.aircraftStates.get(chart12.current.gameState.currentAircraftId));
        return { ...prev, currentAircraftId: chart12.current.gameState.currentAircraftId, aircraftStates: newAircraftStates };
      }
      else if (chart12.current.gameState)
      {
        const newAircraftStates = new Map();
        newAircraftStates.set(chart12.current.gameState.currentAircraftId, chart12.current.gameState.aircraftStates.get(chart12.current.gameState.currentAircraftId));
        return {currentAircraftId: chart12.current.gameState.currentAircraftId, aircraftStates: newAircraftStates};
      }
    });

  };

  const handleMouseUp = (event) => {
    
    const rect =  canvasRef.current.getBoundingClientRect();
    const scaleX =  canvasRef.current.width / rect.width;
    const scaleY =  canvasRef.current.height / rect.height;

    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    chart12.current.handleMouseUp(x, y);
  };

  return (
    <>
      <canvas ref={canvasRef} width={900} height={900} /> 
    </>
  );
}

export default Chart_12