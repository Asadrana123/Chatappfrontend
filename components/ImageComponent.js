import React from 'react';

const ImageComponent = ({ imageUrl }) => {
  return (
    <div className="image-container">
      <img src={imageUrl} alt="Image" width={"60%"}  />
    </div>
  );
};

export default ImageComponent;
