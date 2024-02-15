// eslint-disable-next-line no-unused-vars
import React from 'react';
import '../styles/card.css';

const Card = ({ imageUrl }) => {
  return (
    <div className="card">
      <img src={imageUrl} alt="Image" className="image" />
    </div>
  );
};

export default Card;
