import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiPlus } from "react-icons/fi";
import { useHistory } from "react-router-dom";

import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import happyMapIcon from "../utils/happyMapIcon";
import api from "../services/api";

export default function CreateOrphanage() {
  const history = useHistory();
  const [position, setposition] = useState({
    latitude: 0,
    longitude: 0
  });

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(false);
  const [images, setImages] = useState<File[]>([])
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);

  useEffect( () => {
    console.log(open_on_weekends)
  }, [open_on_weekends]);

  function handleMapClick(evt: LeafletMouseEvent){
    const {lat, lng} = evt.latlng;

    setposition({
      latitude: lat,
      longitude: lng
    });
  }

  async function handleSubmit(evt: FormEvent){
    evt.preventDefault();

    const {latitude, longitude} = position;

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));

    images.forEach(image => data.append('images', image));

    await api.post('orphanages', data);

    alert("Cadastro efetuado!");

    history.push('/app');
  }

  function handleSelectImages(evt: ChangeEvent<HTMLInputElement>){
    if (!evt.target.files){
      return;
    }

    const selectedImages = Array.from(evt.target.files);
    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map(img => {
      return URL.createObjectURL(img);
    });

    setImagesPreview(selectedImagesPreview);
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar/>
      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-27.2092052,-49.6401092]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

              {position.latitude !== 0
                  && <Marker interactive={false} icon={happyMapIcon} position={[position.latitude,position.longitude]} />
              }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={evt => setName(evt.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" maxLength={300} 
                value={about} onChange={evt => setAbout(evt.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {
                  imagesPreview.map(image => {
                    return (
                      <img key={image} src={image} alt={name}/> 
                    );
                  })
                }

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input multiple onChange={handleSelectImages} type="file" id="image[]" />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" 
                value={instructions} onChange={evt => setInstructions(evt.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de Funcionamento </label>
              <input id="opening_hours" 
                value={opening_hours} onChange={evt => setOpeningHours(evt.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={ open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={ !open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
