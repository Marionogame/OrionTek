import React, { useState, useRef } from "react";
import { Icon } from "semantic-ui-react";
import { Map, GoogleApiWrapper } from "google-maps-react";
import { setDefaults, geocode, RequestType } from "react-geocode";

// components
import AddressInput from "../AddressInput";

// Styles
import styles from "./styles.module.css";

interface coordinates {
  lat: number;
  lng: number;
}
interface StaticMapProps {
  initialCenter?: coordinates;
  setGeocodeData?: (item: any) => void;
  zoom?: number;
  mapType?: "satellite" | "roadmap";
  google?: Record<string, any>;
}
const StaticMap: React.FC<StaticMapProps> = ({
  initialCenter = { lat: 18.461174, lng: -69.941578 },
  zoom = 12,
  mapType = "roadmap",
  google,
  setGeocodeData = () => {},
}) => {
  const [center, setCenter] = useState(initialCenter);
  const [address, setAddress] = useState("");
  const mapRef = useRef(null);

  (setDefaults as any)({
    key: "AIzaSyB9eh4EYxyjQhXXOXMQBFOC4e5Ryvmlwn8",
    language: "es",
    region: "do",
  });

  const onReady = (_: any, map: any) => {
    map.setOptions({
      mapTypeId: mapType,
      center,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
    });
    mapRef.current = map;
  };

  const onDragend = (_: any, map: any) => {
    const newCenter = {
      lat: map.center.lat(),
      lng: map.center.lng(),
    };

    geocode(RequestType.LATLNG, `${String(newCenter.lat)},${String(newCenter.lng)}`)
      .then(({ results }) => {
        const addressG = results[0];
        setGeocodeData(addressG);
        setAddress(addressG.formatted_address);
      })
      .catch();
    setCenter(newCenter);
  };

  const getGeometry = (latitudeData: number, longitudeData: number): void => {
    const map: any = mapRef.current;

    const newCenter = {
      lat: latitudeData,
      lng: longitudeData,
    };
    setCenter(newCenter);
    geocode(RequestType.LATLNG, `${String(newCenter.lat)},${String(newCenter.lng)}`)
      .then(({ results }) => {
        const addressG = results[0];

        setGeocodeData(addressG);
        setAddress(addressG.formatted_address);
      })
      .catch();

    map.setOptions({
      mapTypeId: mapType,
      center: newCenter,
    });
    mapRef.current = map;
  };

  const centerMapToUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(userLocation);
        getGeometry(position.coords.latitude, position.coords.longitude);
      });
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* @ts-ignore */}
      <Map
        google={google}
        style={{
          height: `100%`,
          margin: "0px",
          padding: "0px",
        }}
        containerStyle={{
          position: "relative",
          display: "block",
          height: `250px`,
          width: "99%",
          margin: "0px",
          padding: "0px",
        }}
        initialCenter={center}
        zoom={zoom}
        onReady={onReady}
        onDragend={onDragend}>
        <div className={styles.searchContainer}>
          <AddressInput
            value={address}
            icon="map"
            fluid
            getgeometry={getGeometry}
            onChange={(e) => {
              const { value } = e.target;
              setAddress(value);
            }}
            className={styles.input}
            type={""}
            apiKey={""}
            name={""}
          />
        </div>
        <div tabIndex={0} role="button" className={styles.centerButtonContainer} onClick={centerMapToUserLocation}>
          <Icon name="crosshairs" size="large" className={styles.centerIcon} />
        </div>
        <div className={styles.iconContainer}>
          <Icon name="map marker alternate" className={styles.icon} />
        </div>
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({ apiKey: "AIzaSyB9eh4EYxyjQhXXOXMQBFOC4e5Ryvmlwn8" })(StaticMap);
