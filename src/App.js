import { useEffect, useState } from 'react';
import PokemonThumbnails from './PokemonThumbnails';
import PokemonModal from './PokemonModal';
import pokemonJson from "./pokemon.json";
import pokemonTypeJson from "./pokemonType.json";
import reloadIcon from './img/reload-icon.png';

function App() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [selectPokemon, setSelectPokemon] = useState([]);
  const [modalFlag, setModalFlag] = useState(false);
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon?limit=20");
  const [isLoading, setIsLoading] = useState(false);
  const [moreFlag, setMoreFlag] = useState(true);

  let addPokemonFlag = true;

  // 検索ボタン押下でポケモンを検索
  const handleSearchClick = () => {
    let inputValue = document.querySelector('.search-text').value;
    search(inputValue);
  }
  
  const search = (value) => {
    // 検索欄が未入力なら始めの20体を表示
    if (value === "") {
      window.location.reload();
      return;
    }

    // 検索欄に入力されたポケモンを検索
    let serchedPokemons = pokemonJson.filter(
      (pokemon) =>
        pokemon.ja !== undefined &&
        pokemon.ja !== null &&
        pokemon.ja.toUpperCase().indexOf(value.toUpperCase()) !== -1
    )

    // 検索されたポケモンのオブジェクト名を変換
    let serchedPosts = serchedPokemons.map(serchedPokemon => ({
      ja: serchedPokemon.ja,
      name: serchedPokemon.en.charAt(0).toLowerCase() + serchedPokemon.en.slice(1)
    }));

    // 「もっと見る」ボタンを「リロード」アイコンに変更
    setMoreFlag(false);
    addPokemonFlag = false;
    createPokemonObject(serchedPosts, addPokemonFlag);
  }

  // ポケモンを画面に表示
  const getAllPokemons = () => {
    setIsLoading(true);
    // セットされているURLを検索
    fetch(url)
      .then(res => res.json())
      .then(data => {
        createPokemonObject(data.results, addPokemonFlag);

        // 次の20体をURLにセットする
        setUrl(data.next);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  // 取得できたポケモンを表示
  const createPokemonObject = (results, addPokemonFlag) => {
    results.forEach((pokemon, index) => {
      const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`;
      fetch(pokemonUrl)
        .then(res => res.json())
        .then(async (data) => {
          const _image = data.sprites.other["official-artwork"].front_default;
          const _iconImage = data.sprites.other.dream_world.front_default;
          const _type = data.types[0].type.name;
          const japanese = await translateToJapanese(data.name, _type);
          const newList = {
            id: data.id,
            name: data.name,
            image: _image,
            iconImage: _iconImage,
            type: _type,
            jpName: japanese.name,
            jpType: japanese.type
          }

          // 検索表示なら対象ポケモンのみ、それ以外なら追加でポケモンを表示
          if (!addPokemonFlag && index === 0) {
            setAllPokemons([]);
          }
          setAllPokemons(currentList => [...currentList, newList].sort((a, b) => a.id - b.id));
        })
    })
  }

  // ポケモンの名前とタイプを英語から日本語に変換
  const translateToJapanese = async (name, type) => {
    const jpName = await pokemonJson.find(
      (pokemon) => pokemon?.en?.toLowerCase() === name
    ).ja;
    const jpType = await pokemonTypeJson[type];
    return { name: jpName, type: jpType };
  }

  // 画面リロード時に呼び出し
  useEffect(() => {
    getAllPokemons();
  }, [])

  // リロードボタン押下で画面リロード
  const handleReload = () => {
    window.location.reload();
  }


  // 押下されたポケモンのデータを取得してモーダル表示
  const selectedPokemon = (e) => {
    const pokemonJaName = e.target.alt;
    const pokemonEnName = pokemonJson.find(
      (pokemon) => pokemon.ja === pokemonJaName
    )?.en?.toLowerCase();
    const pokeUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonEnName}`;
    fetch(pokeUrl)
      .then(res => res.json())
      .then(async (data) => {
        const typesArray = data.types;
        const _types = [];
        const _jpTypes = [];
        typesArray.forEach(types => {
          _types.push(types.type.name);
          _jpTypes.push(pokemonTypeJson[types.type.name]);
        })

        const _gifImages = {
          frontDefault: data.sprites.other["showdown"].front_default,
          backDefault: data.sprites.other["showdown"].back_default,
          frontShiny: data.sprites.other["showdown"].front_shiny,
          backShiny: data.sprites.other["showdown"].back_shiny
        }

        const abilitiesArray = data.abilities;
        const _abilities = [];
        const _abilityDetails = [];
        abilitiesArray.forEach(abilities => {
          let abilitiesUrl = abilities.ability.url;
            fetch(abilitiesUrl)
              .then(res => res.json())
              .then(async (datas) => {
                datas.names.forEach(data => {
                  if (data.language.name === "ja") {
                    _abilities.push(data.name);
                  }
                })
                let loopFlag = true;
                datas.flavor_text_entries.forEach(data => {
                  if (loopFlag && data.language.name === "ja") {
                    _abilityDetails.push(data.flavor_text);
                    loopFlag = false;
                  }
                })
              })
        });

        const _height = data.height;
        const _weight = data.weight;

        const _stats = data.stats;

        const modalList = {
          id: data.id,
          jpName: pokemonJaName,
          types: _types,
          jpTypes: _jpTypes,
          gifImages: _gifImages,
          abilities: _abilities,
          abilityDetails: _abilityDetails,
          height: _height,
          weight: _weight,
          stats: _stats
        }

        setSelectPokemon(currentList => [...currentList, modalList]);
      })
    openModal();
  }

  // モーダルの表示非表示判定
  const openModal = () => {
    setModalFlag(true);
  }

  const closeModal = () => {
    setModalFlag(false);
  }

  return (
    <div className="app-container">
      <h1 className='title'>ポケモン図鑑</h1>
      <div className='search-form'>
        <input type='text' className='search-text' placeholder='名前で検索' />
        <input type='submit' className='search-btn' value='検索' onClick={handleSearchClick} />
      </div>
      <div className='pokemon-container'>
        <div className='all-container'>
          {allPokemons.map((pokemon, index) => (
            <button className={`thumb-container ${pokemon.type}`} onClick={selectedPokemon.bind(this)}>
              <PokemonThumbnails
                id={pokemon.id}
                name={pokemon.name}
                jpName={pokemon.jpName}
                image={pokemon.image}
                iconImage={pokemon.iconImage}
                type={pokemon.type}
                jpType={pokemon.jpType}
                key={index}
              />
            </button>
          ))}
        </div>
        {
          moreFlag ? (
            isLoading ? (
              <div className='load-more'>now loading...</div>
            ) : (
              <button className='load-more' onClick={getAllPokemons}>もっとみる！</button>
            )
          ) : (
            <div className='reload' onClick={handleReload}>
              <img className="reload-icon" src={reloadIcon} alt="リロード" />
            </div>
          )
        }
      </div>
      {
        modalFlag ? 
        selectPokemon.map((pokemon, index) => (
          <PokemonModal
            modalState={closeModal}
            id={pokemon.id}
            jpName={pokemon.jpName}
            types={pokemon.types}
            jpTypes={pokemon.jpTypes}
            sound={pokemon.sound}
            gifImages={pokemon.gifImages}
            abilities={pokemon.abilities}
            abilityDetails={pokemon.abilityDetails}
            height={pokemon.height}
            weight={pokemon.weight}
            stats={pokemon.stats}
            key={index}
          />
        )) : null
      }
    </div>
  );
}

export default App;
