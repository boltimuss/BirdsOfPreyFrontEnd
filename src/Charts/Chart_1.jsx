import React, { useRef, useEffect, useContext } from 'react';
import { Chart1 } from '../Nomograph/Charts/Chart1.ts';
import { Rectangle2D } from '../Nomograph/SupportObjects/Rectangle2D.ts';
import { GameStateCtx } from '../GameState.jsx'

function Chart_1() {

  const canvasRef = useRef(null);
  const chart1 = useRef(null);
  const { gameState, setGameState } = useContext(GameStateCtx);

  useEffect(() => {
    draw();
    canvasRef.current.addEventListener('mousemove', handleMouseMove);
    canvasRef.current.addEventListener('mousedown', handleMouseDown);
    canvasRef.current.addEventListener('mouseup', handleMouseUp);
    canvasRef.current.addEventListener('click', handleMouseClick);
  }, []);  

  const handleMouseDown = (event) => {
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    chart1.current.handleMouseDown(x, y);
  }; 

  const handleMouseClick = (event) => {
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    chart1.current.handleMouseClick(x, y);
  };

  const handleMouseMove = (event) => {
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    chart1.current.handleMouseMove(x, y);

    setGameState(prev => {

      if (prev && chart1.current.gameState) {
        const newAircraftStates = new Map(prev.aircraftStates);
        newAircraftStates.set(chart1.current.gameState.currentAircraftId, chart1.current.gameState.aircraftStates.get(chart1.current.gameState.currentAircraftId));
        return { ...prev, currentAircraftId: chart1.current.gameState.currentAircraftId, aircraftStates: newAircraftStates };
      }
      else if (chart1.current.gameState)
      {
        const newAircraftStates = new Map();
        newAircraftStates.set(chart1.current.gameState.currentAircraftId, chart1.current.gameState.aircraftStates.get(chart1.current.gameState.currentAircraftId));
        return {currentAircraftId: chart1.current.gameState.currentAircraftId, aircraftStates: newAircraftStates};
      }
    });

  };

  const handleMouseUp = (event) => {
    
    const rect =  canvasRef.current.getBoundingClientRect();
    const scaleX =  canvasRef.current.width / rect.width;
    const scaleY =  canvasRef.current.height / rect.height;

    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    chart1.current.handleMouseUp(x, y);
    
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (canvas && chart1.current == null) {
      const ctx = canvas.getContext('2d');
      chart1.current = new Chart1(new Rectangle2D(0, 0, 450, 450), ctx, gameState);
      chart1.current.init();
    }
  };

  return (
    <>
      <canvas ref={canvasRef} width={450} height={450} />
    </>
  );
}

export default Chart_1