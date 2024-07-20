import React, { useRef, useState, useEffect } from "react";
import "./homepage.css";
import { UndoRedo } from "./UndoRedo";

export const Canvas = () => {
  const canvasRef = useRef(null);
  const [textArray, setTextArray] = useState([]);
  const [selectedTextIndex, setSelectedTextIndex] = useState(null);
  const [text, setText] = useState("");
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
   

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    textArray.forEach((textItem, index) => {
      ctx.font = `${textItem.fontSize}px ${textItem.fontFamily}`;
      ctx.fillStyle = textItem.color;
      ctx.fillText(textItem.text, textItem.x, textItem.y);

      if (index === selectedTextIndex) {
        ctx.strokeStyle = "red";
        ctx.strokeRect(
          textItem.x - 2,
          textItem.y - textItem.fontSize,
          ctx.measureText(textItem.text).width + 4,
          textItem.fontSize + 4
        );
      }
    });
  }, [textArray, selectedTextIndex]);

  const addText = () => {
    const newTextArray = [
      ...textArray,
      { text, x: position.x, y: position.y, color, fontSize, fontFamily },
    ];
    updateHistory(newTextArray);

    setText("");
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedTextIndex = textArray.findIndex(
      (textItem) =>
        x >= textItem.x &&
        x <=
          textItem.x +
            canvas.getContext("2d").measureText(textItem.text).width &&
        y >= textItem.y - 20 &&
        y <= textItem.y
    );

    if (clickedTextIndex !== -1) {
      const selectedItem = textArray[clickedTextIndex];
      setSelectedTextIndex(clickedTextIndex);
      setText(selectedItem.text);
      setPosition({ x: selectedItem.x, y: selectedItem.y });
      setColor(selectedItem.color);
      setFontSize(selectedItem.fontSize);
      setFontFamily(selectedItem.fontFamily);
    } else {
      setSelectedTextIndex(null);
      setText("");
    }
  };

  const updateText = () => {
    if (selectedTextIndex !== null) {
      const updatedTextArray = [...textArray];
      updatedTextArray[selectedTextIndex] = {
        text,
        x: position.x,
        y: position.y,
        color,
        fontSize,
        fontFamily,
      };
      updateHistory(updatedTextArray);
    }
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedTextIndex = textArray.findIndex(
      (textItem) =>
        x >= textItem.x &&
        x <=
          textItem.x +
            canvas.getContext("2d").measureText(textItem.text).width &&
        y >= textItem.y - 20 &&
        y <= textItem.y
    );

    if (clickedTextIndex !== -1) {
      const offsetX = x - textArray[clickedTextIndex].x;
      const offsetY = y - textArray[clickedTextIndex].y;
      setSelectedTextIndex(clickedTextIndex);
      setDragOffset({ x: offsetX, y: offsetY });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const updatedTextArray = [...textArray];
      updatedTextArray[selectedTextIndex] = {
        ...updatedTextArray[selectedTextIndex],
        x: x - dragOffset.x,
        y: y - dragOffset.y,
      };
      setTextArray(updatedTextArray);
    }
  };

  const handleMouseUp = () => {
    if(isDragging){
      const updatedTextArray = [...textArray];
      setTextArray(updatedTextArray);
      updateHistory(updatedTextArray);
    }
    setIsDragging(false);
  };

  const updateHistory = (newTextArray) =>{
    const newHistory = [...history.slice(0, historyIndex + 1), newTextArray];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setTextArray(newTextArray);
  }

  const undo = () => {
    if(historyIndex > 0){
      setHistoryIndex(historyIndex - 1);
      setTextArray(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if(historyIndex < history.length - 1){
      setHistoryIndex(historyIndex + 1);
      setTextArray(history[historyIndex + 1]);
    } 
  }



  return (
    <div className="container">
    
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={500}
          height={600}
          style={{ border: "1px solid black" }}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>
      <div className="toolbar-container">
        <div className="tool-container">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text"
          />
          <button onClick={selectedTextIndex === null ? addText : updateText}>
            {selectedTextIndex === null ? "Add Text" : "Update Text"}
          </button>
        </div>
        <div className="tool-container">
          <label>Color: </label>
          <input
            type="color"
            name="fontColor"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div className="tool-container">
          <label>Font Size : </label>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="tool-container2">
          <label>Font Family : </label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
          >
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
          </select>

      <UndoRedo onUndo={undo} onRedo={redo} canUndo={historyIndex > 0} canRedo={historyIndex < history.length - 1}/>
        </div>
      </div>
    </div>
  );
};
