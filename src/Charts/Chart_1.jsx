import React, { useRef, useEffect } from 'react';
import { Chart1 } from '../Nomograph/Charts/Chart1.ts';
import { Rectangle2D } from '../Nomograph/SupportObjects/Rectangle2D.ts';

function Chart_1() {

  const canvasRef = useRef(null);
  const chart1 = useRef(null);

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
      chart1.current = new Chart1(new Rectangle2D(0, 0, 900, 900), ctx);
      chart1.current.init();
    }
    // else if (chart1.current !== null) {
    //   chart1.current.drawLines();
    // }
      
  };

  return (
    <>
      <canvas ref={canvasRef} width={900} height={900} />
    </>
  );
}

export default Chart_1