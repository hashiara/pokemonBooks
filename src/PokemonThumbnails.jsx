import React from "react";
import './common.css';
import './css/PokemonThumbnails.css';

// アロー関数でコンポーネントを定義
const PokemonThumbnails = ({ id, jpName, image, iconImage, jpType, key }) => {
  
  return (
    <>
      <div className="number">
        <input className="id" type="button" key={key} value={`No.${id}`} />
      </div>
      <img src={image} alt={jpName} />
      <img src={iconImage} alt={jpName} className="icon-image" />
      <div className="detail-wrapper">
        <h3>{jpName}</h3>
        <h4>{jpType}</h4>
      </div>
    </>
  );
};

export default PokemonThumbnails;