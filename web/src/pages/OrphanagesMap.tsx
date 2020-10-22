import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlus } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import Leaflet from 'leaflet';

import mapMarkerImg from '../images/map-marker.svg';

import '../styles/pages/orphanages-map.css';
import api from '../services/api';

const mapIcon = Leaflet.icon({
    iconUrl: mapMarkerImg,
    iconSize: [58, 68],
    iconAnchor:  [29, 68],
    popupAnchor: [170, 2]
});

interface Orphanage{
    id: number,
    latitude: number,
    longitude: number,
    name: string
}

function OrpanagesMap(){
    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

    useEffect( () => {
        api.get('orphanages').then(res => {
            setOrphanages(res.data);
        })
    }, []);

    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt='Happy'/>
                    <h2>
                        Escolha um orfanato no mapa
                    </h2>
                    <p>
                         Muitas crianças estão esperando sua visita
                    </p>
                </header>

                <footer>
                    <strong>
                        Curitiba
                    </strong>
                    <span>
                        Paraná
                    </span>
                </footer>
            </aside>

            <Map
                center={[-25.4278644,-49.2750788]}
                zoom={17}
                style={
                    {
                        width: '100%',
                        height: '100%'
                    }
                }
            >
                <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

                {orphanages.map(orphanage => {
                    return (
                            <Marker
                                icon={mapIcon}
                                position= {[orphanage.latitude,orphanage.longitude]}
                                key={orphanage.id}
                            >
                            <Popup
                                closeButton={false}
                                minWidth={240}
                                maxWidth={240}
                                className="map-popup"
                            >
                                {orphanage.name}
                                <Link to={`/orphanages/${orphanage.id}`}>
                                    <FiArrowRight size={20} color="#FFF"/>
                                </Link>
                            </Popup>
                            </Marker>
                        )}
                    )
                }
            </Map>

            <Link to="/orphanages/create" className="create-orphanage">
                <FiPlus size={32} color="#FFF" />
            </Link>
        </div>
    );
}

export default OrpanagesMap;