import React, { useRef, useEffect, useContext } from 'react';
import { Chart4 } from '../Nomograph/Charts/Chart4.ts';
import { Rectangle2D } from '../Nomograph/SupportObjects/Rectangle2D.ts';
import { GameStateCtx } from '../GameState.jsx'

function Chart_4() {

  const canvasRef = useRef(null);
  const chart4 = useRef(null);
  const { gameState, setGameState } = useContext(GameStateCtx);

  useEffect(() => {

    const canvas = canvasRef.current;
    if (chart4.current)
    {
      chart4.current.gameState = gameState;
      chart4.current.drawLines(); 
    }
    else {
      const ctx = canvas.getContext('2d');
      chart4.current = new Chart4(new Rectangle2D(0, 0, 900, 900), ctx);
      chart4.current.init();
      canvasRef.current.addEventListener('mousemove', handleMouseMove);
      canvasRef.current.addEventListener('mousedown', handleMouseDown);
      canvasRef.current.addEventListener('mouseup', handleMouseUp);
      canvasRef.current.addEventListener('click', handleMouseClick);
    }
    
  }, [gameState]);  

  const handleMouseDown = (event) => {
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    chart4.current.gameState = gameState;
    chart4.current.handleMouseDown(x, y);
    setGameState(prev => {
      const newAircraftStates = new Map(prev.aircraftStates);
      newAircraftStates.set(chart4.current.gameState.currentAircraftId, chart4.current.gameState.aircraftStates.get(chart4.current.gameState.currentAircraftId));
      return { ...prev, aircraftStates: newAircraftStates };
    });
  };

  const handleMouseClick = (event) => {
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    chart4.current.handleMouseClick(x, y);
  };

  const handleMouseMove = (event) => {
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    chart4.current.handleMouseMove(x, y);
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