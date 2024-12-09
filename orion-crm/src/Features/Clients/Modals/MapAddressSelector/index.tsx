import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Icon, Container } from "semantic-ui-react";
import { get, map, includes, find, isEmpty } from "lodash";

// External Components
import TextareaAutosize from "react-textarea-autosize";
import Input from "../../../../Components/Input";
import Joi from "joi";

// Components
import DraggableMap from "../../Components/DraggableMap";

// Styles
import styles from "./styles.module.css";
import { AddressInterface } from "../../../../Interface/Client";
interface Props {
  onClose: () => void;
  onSelect: (data: AddressInterface, string: string) => void;
  cardValue: AddressInterface;
  modalCrud: string;
}

interface error {
  title: string;
  city: string;
  street: string;
  province: string;
  postalCode: string;
  streetNumber: string;
}
const MapAddressSelector: React.FC<Props> = ({ onClose, modalCrud, cardValue, onSelect }) => {
  const [title, setTitle] = useState<string>("");
  const [referenceToArrive, setReferenceToArrive] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [sector, setSector] = useState<string>("");
  const [zone, setZone] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [streetNumber, setStreetNumber] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [geocodeData, setGeocodeData] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [errors, setErrors] = useState<error>({
    title: "",
    city: "",
    street: "",
    province: "",
    postalCode: "",
    streetNumber: "",
  });

  const schema = Joi.object().keys({
    title: Joi.string().min(2).messages({
      "string.min": "Title must be at least 4 characters long",
      "string.empty": "Title is a required field",
    }),
    city: Joi.string().min(2).messages({
      "string.min": "City must be at least 4 characters long",
      "string.empty": "City is a required field",
    }),
    street: Joi.string().min(2).messages({
      "string.min": "Street must be at least 4 characters long",
      "string.empty": "Street is a required field",
    }),
    province: Joi.string().min(2).messages({
      "string.min": "Province must be at least 4 characters long",
      "string.empty": "Province is a required field",
    }),
    postalCode: Joi.string().min(2).messages({
      "string.min": "PostalCode must be at least 4 characters long",
      "string.empty": "PostalCode is a required field",
    }),
    streetNumber: Joi.string().min(2).messages({
      "string.min": "StreetNumber must be at least 4 characters long",
      "string.empty": "StreetNumber is a required field",
    }),
  });
  useEffect(() => {
    if (modalCrud === "Edit") {
      setTitle(get(cardValue, "title", ""));
      setPostalCode(get(cardValue, "postalCode", "") || "");
      setStreetNumber(get(cardValue, "streetNumber", ""));
      setStreet(get(cardValue, "street", ""));
      setZone(get(cardValue, "zone", "") || "");
      setSector(get(cardValue, "sector", "") || "");
      setCity(get(cardValue, "city", ""));
      setProvince(get(cardValue, "province", ""));
      setReferenceToArrive(get(cardValue, "referenceToArrive", "") || "");
      setLatitude(get(cardValue, "latitude", null));
      setLongitude(get(cardValue, "longitude", null));
    }
  }, []);

  // modal
  const cancelModal = () => {
    onClose();
  };

  const geocodeDataHandler = (item: any) => {
    setGeocodeData(item);
    const addressComponents = get(item, "address_components", []);

    const streetNoFilter = find(addressComponents, (addressItem) => {
      return includes(addressItem.types, "street_number");
    });

    const streetFilter = find(addressComponents, (addressItem) => {
      return includes(addressItem.types, "route");
    });

    const sectorFilter = find(addressComponents, (addressItem) => {
      return includes(addressItem.types, "administrative_area_level_2");
    });

    const zoneFilter = find(addressComponents, (addressItem) => {
      return includes(addressItem.types, "sublocality_level_1");
    });

    const cityFilter = find(addressComponents, (addressItem) => {
      return includes(addressItem.types, "locality");
    });

    const provinceFilter = find(addressComponents, (addressItem) => {
      return includes(addressItem.types, "administrative_area_level_1");
    });

    const postalCodeFilter = find(addressComponents, (addressItem) => {
      return includes(addressItem.types, "postal_code");
    });

    setPostalCode(get(postalCodeFilter, "long_name", ""));
    setStreetNumber(get(streetNoFilter, "long_name", ""));
    setStreet(get(streetFilter, "long_name", ""));
    setZone(get(zoneFilter, "long_name", ""));
    setSector(get(sectorFilter, "long_name", ""));
    setCity(get(cityFilter, "long_name", ""));
    setProvince(get(provinceFilter, "long_name", ""));
  };
  const handlerSaved = async () => {
    const validation = schema.validate({ title, city, street, province, postalCode, streetNumber }, { abortEarly: false });
    if (validation.error) {
      const { details } = validation.error;
      let errorsVal = {
        title: "",
        city: "",
        street: "",
        province: "",
        postalCode: "",
        streetNumber: "",
      };
      map(details, (item) => {
        errorsVal = { ...errorsVal, [get(item, "context.key", "")]: item.message };
      });
      setErrors(errorsVal);
    } else {
      let addressDataToSave: AddressInterface = {
        title,
        referenceToArrive,
        province,
        city,
        sector: isEmpty(sector) ? null : sector,
        zone: isEmpty(zone) ? null : zone,
        street: street,
        streetNumber: streetNumber,
        postalCode: isEmpty(postalCode) ? null : postalCode,
        latitude: !isEmpty(geocodeData) ? get(geocodeData, "geometry.location.lat", null) : latitude,
        longitude: !isEmpty(geocodeData) ? get(geocodeData, "geometry.location.lng", null) : longitude,
      };
      if (modalCrud === "Edit") {
        addressDataToSave = { idClient: cardValue.idClient, addressId: cardValue.addressId, order: cardValue.order, ...addressDataToSave };
      }
      onSelect(addressDataToSave, modalCrud);
      setTitle("");
      setPostalCode("");
      setStreetNumber("");
      setStreet("");
      setZone("");
      setSector("");
      setCity("");
      setProvince("");
      setReferenceToArrive("");
      setLatitude(null);
      setLongitude(null);
      setErrors({
        title: "",
        city: "",
        street: "",
        province: "",
        postalCode: "",
        streetNumber: "",
      });
    }
  };

  return (
    <Modal className={styles.modalFirst} open>
      <Modal.Header className={styles.modalHeader}>
        <div className={styles.modalHeader}>
          <Icon name="map marker alternate" />
          Select Location
        </div>
      </Modal.Header>
      <Modal.Content className={styles.modalContent} scrolling>
        {/* @ts-ignore */}
        <DraggableMap setGeocodeData={geocodeDataHandler} defaultCenter={location} />
        <div className={styles.infoBanner}>
          <Icon name="map marker alternate" />
          Enter your address or enter a nearby location. Then drag the map to point to your exact address.
        </div>

        <Container text>
          <Form className={styles.form}>
            <Input
              required
              fluid
              name="name"
              value={title}
              icon="map"
              placeholder="Title"
              onChange={(e, { value }) => {
                setTitle(value);
              }}
              error={
                !isEmpty(errors.title) && {
                  content: errors.title,
                  pointing: "above",
                }
              }
            />
            <div className={styles.rowInputContainer}>
              <Input
                label="Province"
                required
                className={styles.input}
                name="province"
                value={province}
                icon="map"
                placeholder="Province"
                onChange={(e, { value }) => {
                  setProvince(value);
                }}
                error={
                  !isEmpty(errors.province) && {
                    content: errors.province,
                    pointing: "above",
                  }
                }
              />
              <Input
                label="City"
                required
                className={styles.input}
                name="city"
                value={city}
                icon="map"
                placeholder="City"
                onChange={(e, { value }) => {
                  setCity(value);
                }}
                error={
                  !isEmpty(errors.city) && {
                    content: errors.city,
                    pointing: "above",
                  }
                }
              />
            </div>
            <div className={styles.rowInputContainer}>
              <Input
                label="Sector"
                className={styles.input}
                name="sector"
                value={sector}
                icon="map"
                placeholder="Sector"
                onChange={(e, { value }) => {
                  setSector(value);
                }}
              />
              <Input
                label="Zone"
                className={styles.input}
                name="zone"
                value={zone}
                icon="map"
                placeholder="Zone"
                onChange={(e, { value }) => {
                  setZone(value);
                }}
              />
            </div>
            <div className={styles.rowInputContainer}>
              <Input
                required
                label="Street"
                className={styles.input}
                name="street"
                value={street}
                icon="map"
                placeholder="Street"
                onChange={(e, { value }) => {
                  setStreet(value);
                }}
                error={
                  !isEmpty(errors.street) && {
                    content: errors.street,
                    pointing: "above",
                  }
                }
              />
              <Input
                required
                label="Street Number"
                className={styles.input}
                name="streetNumber"
                value={streetNumber}
                icon="map"
                placeholder="Street Number"
                onChange={(e, { value }) => {
                  setStreetNumber(value);
                }}
                error={
                  !isEmpty(errors.streetNumber) && {
                    content: errors.streetNumber,
                    pointing: "above",
                  }
                }
              />
            </div>
            <Input
              required
              label="Postal Code"
              fluid
              type="number"
              className={styles.input}
              name="postalCode"
              value={postalCode}
              icon="globe"
              placeholder="Postal Code"
              onChange={(e, { value }) => {
                setPostalCode(value);
              }}
              error={
                !isEmpty(errors.postalCode) && {
                  content: errors.postalCode,
                  pointing: "above",
                }
              }
            />
            <span className={styles.customLabel}>References to get there:</span>
            <TextareaAutosize
              placeholder="You can add any additional information that will help us get there faster (between which streets you are, any references, etc.)"
              value={referenceToArrive}
              onChange={(e) => {
                setReferenceToArrive(e.target.value);
              }}
              className={styles.textArea}
            />
          </Form>
        </Container>
      </Modal.Content>
      <Modal.Actions className={styles.modalFooter}>
        <Button className={styles.negativeButton} onClick={cancelModal}>
          Atrás
        </Button>
        <Button className={styles.positiveButton} onClick={handlerSaved}>
          Seleccionar
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default MapAddressSelector;
