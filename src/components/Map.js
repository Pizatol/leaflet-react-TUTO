import React, { useRef, useEffect, useState } from "react";

import {
    MapContainer,
    TileLayer,
    LayersControl,
    GeoJSON,
    ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import parks from "../nationalPark.json";
import "./Maps.css";
import db from "../db.json";

export default function Map() {
    const location = [45.194771, -109.246788];
    const zoom = 6;
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

        // place les indicateurs du JSON sur la map

        const places = new L.GeoJSON(parks, {
            pointToLayer: (feature, latlong) => {
                return L.marker(latlong, {});
            },

            //     // CUSTOM POPUP VENANT DE LA DATA DU JSON

            onEachFeature: (feat = {}, layer) => {
                const { properties = {} } = feat;
                const { name } = properties;
                if (!name) return;
                layer.bindPopup(` <p> ${name} </p>  `);
            },
        });
        places.addTo(map);

        // locate() permet de géolocaliser l'utilisateur

        // map.locate({
        //     setView: true,
        //     ZoomControl: false,
        // });

        // donne les coordonnées (lat long) du clic 
        map.on('click', function(e){
          var coord = e.latlng;
          var lat = coord.lat;
          var lng = coord.lng;
          console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
          });

    }, [map]);

    // Permet de changer le visuel de la map
    const { BaseLayer } = LayersControl;

   
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
                {/* LayersControl est le controleur qui change le visuel de la map */}
                <LayersControl>
                    {/* BaseLayer est une couche de la map */}
                    <BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ZoomControl position="bottomright" />
                    </BaseLayer>

                    <BaseLayer name="NASA Gibs blue Marble ">
                        <TileLayer url="https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg" />
                    </BaseLayer>
                </LayersControl>

                {/* GeoJson utilise une db pour placer des marqueurs */}
                <GeoJSON data={db} />
            </MapContainer>
        </div>
    );
}
