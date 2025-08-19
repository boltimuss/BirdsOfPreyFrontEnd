/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useContext } from 'react';
import { Chart2 } from '../Nomograph/Charts/Chart2.ts';
import { Rectangle2D } from '../Nomograph/SupportObjects/Rectangle2D.ts';
import { GameStateCtx } from '../GameState.jsx'

function Chart_2() {

  const canvasRef = useRef(null);
  const chart2 = useRef(null);
  const { gameState, setGameState } = useContext(GameStateCtx);
  const { aircraftStates, currentAircraftId } = gameState;
  const keas = (aircraftStates && aircraftStates.get(currentAircraftId)) ? aircraftStates.get(currentAircraftId)["KEAS"] : 0;
  const altitude = (aircraftStates && aircraftStates.get(currentAircraftId)) ? aircraftStates.get(currentAircraftId)["altitude"] : 0;

  useEffect(() => {
    draw();
    // canvasRef.current.addEventListener('mousemove', handleMouseMove);
    // canvasRef.current.addEventListener('mousedown', handleMouseDown);
    // canvasRef.current.addEventListener('mouseup', handleMouseUp);
    // canvasRef.current.addEventListener('click', handleMouseClick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keas, altitude]);  

  // const handleMouseDown = (event) => {
    
  //   const rect = canvasRef.current.getBoundingClientRect();
  //   const scaleX = canvasRef.current.width / rect.width;
  //   const scaleY = canvasRef.current.height / rect.height;

  //   let x = (event.clientX - rect.left) * scaleX;
  //   let y = (event.clientY - rect.top) * scaleY;
  //   chart2.current.handleMouseDown(x, y);

  //    setGameState(prev => {

  //     if (prev &&  chart2.current.gameState) {
  //       const newAircraftStates = new Map(prev.aircraftStates);
  //       newAircraftStates.set(chart2.current.gameState.currentAircraftId, chart2.current.gameState.aircraftStates.get(chart2.current.gameState.currentAircraftId));
  //       return { ...prev, currentAircraftId: chart2.current.gameState.currentAircraftId, aircraftStates: newAircraftStates };
  //     }
  //     else if (chart2.current.gameState)
  //     {
  //       const newAircraftStates = new Map();
  //       newAircraftStates.set(chart2.current.gameState.currentAircraftId, chart2.current.gameState.aircraftStates.get(chart2.current.gameState.currentAircraftId));
  //       return {currentAircraftId: chart2.current.gameState.currentAircraftId, aircraftStates: newAircraftStates};
  //     }
  //   });

  // };

  // const handleMouseClick = (event) => {
    
  //   const rect = canvasRef.current.getBoundingClientRect();
  //   const scaleX = canvasRef.current.width / rect.width;
  //   const scaleY = canvasRef.current.height / rect.height;

  //   let x = (event.clientX - rect.left) * scaleX;
  //   let y = (event.clientY - rect.top) * scaleY;
  //   chart2.current.handleMouseClick(x, y);
  // };

  // const handleMouseMove = (event) => {
    
  //   const rect = canvasRef.current.getBoundingClientRect();
  //   const scaleX = canvasRef.current.width / rect.width;
  //   const scaleY = canvasRef.current.height / rect.height;

  //   let x = (event.clientX - rect.left) * scaleX;
  //   let y = (event.clientY - rect.top) * scaleY;
  //   chart2.current.handleMouseMove(x, y);
  // };

  // const handleMouseUp = (event) => {
    
  //   const rect =  canvasRef.current.getBoundingClientRect();
  //   const scaleX =  canvasRef.current.width / rect.width;
  //   const scaleY =  canvasRef.current.height / rect.height;

  //   let x = (event.clientX - rect.left) * scaleX;
  //   let y = (event.clientY - rect.top) * scaleY;
  //   chart2.current.handleMouseUp(x, y);
  // };

  const draw = () => {
    const canvas = canvasRef.current;
    if (canvas && chart2.current == null) {
      const ctx = canvas.getContext('2d');
      chart2.current = new Chart2(new Rectangle2D(0, 0, 450, 450), ctx);
      chart2.current.init();
    }
    else if (chart2.current)
    {
      chart2.current.gameState = gameState;
      chart2.current.execute();
    }
  };

  return (
    <>
      <canvas ref={canvasRef} width={450} height={450} />
    </>
  );
}

export default Chart_2