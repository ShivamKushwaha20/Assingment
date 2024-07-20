import React from 'react'

export const UndoRedo = ({onUndo, onRedo, canUndo, canRedo}) => {
  return (
    <div>
        
        <button onClick={onUndo} disabled={!canUndo}>undo</button>
        <button onClick={onRedo} disabled={!canRedo}>Redo</button>
    </div>
  );
};

