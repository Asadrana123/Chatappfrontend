import React from 'react';
import ImageComponent from './ImageComponent';

const ChatMessage = ({ imageUrl, mymargin }) => {
  return (
    <div className="myimg" 
      style={{marginLeft:mymargin}}
    >
      {imageUrl && <ImageComponent imageUrl={imageUrl} />}
    </div>
  );
};

export default ChatMessage;
