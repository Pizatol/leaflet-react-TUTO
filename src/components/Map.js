import React, { useRef, useEffect, useState } from "react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import parks from "../nationalPark.json";
import "./Maps.css";
import customIcon from '../greenIcon.png'

export default function Map() {
    const location = [45.194771, -109.246788];
    const zoom = 7;
    const [map, setMap] = useState(null);

    // CHANGEMENT ICONE

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });

    useEffect(() => {
        if (!map) return;

      // CUSTOM ICON
      const placeIcon = new L.Icon({
        iconUrl : customIcon,
        iconSize: [26, 26],
        popupAnchor: [0, -15],
        shadowUrl : markerShadow,
        shadowAnchor: [8, 30 ]
      })


        // place les indicateurs du JSON sur la map
        const places = new L.GeoJSON(parks, {

            pointToLayer: (feature, latlong) => {
              return L.marker(latlong, {
                icon: placeIcon
              })
            },

          // CUSTOM POPUP VENANT DE LA DATA DU JSON
            onEachFeature: (feat = {}, layer) => {
                const { properties = {} } = feat;
                const { name } = properties;
                if (!name) return;
                layer.bindPopup(` <p> ${name} </p>  `)
            },
        });
        places.addTo(map);
    }, [map]);

    return (
        <div>
            <MapContainer
                // WHEN CREATED permet d'acceder aux parametres de la map, qu'on place dans un state
                shadowAnchor={false}
                whenCreated={setMap}
                center={location}
                zoom={zoom}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomControl position="bottomright" />
            </MapContainer>
        </div>
    );
}
