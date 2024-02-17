import React, { useRef } from 'react';
import './common.css';
import './css/PokemonModal.css';
import soundIcon from './img/sound-icon.png';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import useSound from 'use-sound';

// アロー関数でコンポーネントを定義
const PokemonModal = ({ modalState, id, jpName, gifImages, types, jpTypes, sound, abilities, abilityDetails, height, weight, stats }) => {
  const [play] = useSound(`${sound}`);
  const sliderRef = useRef();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const formatNumber = (num) => {
    const numStr = num.toString();
    if (numStr.length === 1) {
      return '0.' + numStr;
    } else {
      return numStr.slice(0, -1) + '.' + numStr.slice(-1);
    }
  };

  // const slideNext = () => {
  //   sliderRef.current.slickNext();
  // };

  // const slidePrev = () => {
  //   sliderRef.current.slickPrev();
  // };

  // ステータスグラフのデータ
  const status = {
    HP: stats[0].base_stat,
    こうげき: stats[1].base_stat,
    ぼうぎょ: stats[2].base_stat,
    とくこう: stats[3].base_stat,
    とくぼう: stats[4].base_stat,
    すばやさ: stats[5].base_stat
  };

  const maxStat = 200;
  
  return (
    <>
      <div className={`modal-container-outer ${types[0]}`}>
        <span className="close-icon" onClick={modalState}>＋</span>
        <div className="modal-container">
          <div className="top-row">
            <div className="header">
              <h1 className="font-l">{id}　{jpName}</h1>
              <div className="sound" onClick={() => play()}>
                <img className="sound-icon" src={soundIcon} alt="サウンド" />
              </div>
            </div>
            <div className="pokemon-dynamic">
              {/* <span className="slide-icon slide-left" onClick={slidePrev}>◀</span> */}
              <div className="pokemon-images">
                {/* slideライブラリ(react-slick)を使用 */}
                <Slider ref={sliderRef} {...settings}>
                  <img className="pokemon-image" src={gifImages.frontDefault} alt={jpName} />
                  <img className="pokemon-image" src={gifImages.backDefault} alt={jpName} hidden />
                  <img className="pokemon-image" src={gifImages.frontShiny} alt={jpName} hidden />
                  <img className="pokemon-image" src={gifImages.backShiny} alt={jpName} hidden />
                </Slider>
              </div>
              {/* <span className="slide-icon slide-right" onClick={slideNext}>▶</span> */}
            </div>
          </div>
        
          <div className="modal-content">
            <div className="pokemon-info">
              <section className="base-info">
                <div className="type">
                {types.map((type, index) =>
                  <p className={type}>{jpTypes[index]}</p>
                )}
                </div>
                <div className="abilities">
                  <span className="font-l">特性</span>
                  <div className="ability">
                    {abilities.map((ability, index) => 
                      <div className="ability-one">
                        <p className="font-w">{ability}</p>
                        <p>{abilityDetails[index]}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="size">
                  <p>高さ：{formatNumber(height)}m</p>
                  <p>重さ：{formatNumber(weight)}kg</p>
                </div>
                <div className="status">
                  {Object.entries(status).map(([key, value]) => (
                    <div key={key} className="status-row">
                      <p>{key}：{value}</p>
                      <div className="status-bar-bg">
                        <div 
                          className="status-bar-fill" 
                          style={{ width: `${(value / maxStat) * 100}%` }} 
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PokemonModal;