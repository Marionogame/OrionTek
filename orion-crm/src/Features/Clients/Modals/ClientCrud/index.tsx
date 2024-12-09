import React, { useState, useEffect } from "react";
import { Button, Form, Modal, FormInput, Icon, Grid } from "semantic-ui-react";
import { isEmpty, map, get, reject, orderBy, maxBy } from "lodash";
import Joi from "joi";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import axios from "axios";

import TextareaAutosize from "react-textarea-autosize";
import MapAddressSelector from "../../Modals/MapAddressSelector";
import ListCardOrionRegister from "../../Components/ListCardOrionRegister";
import Text from "../../../../Components/Text";
import { phoneFormat } from "../../../../Utils/formats";
import styles from "./styles.module.css";
import { ClientInterface, AddressInterface } from "../../../../Interface/Client";
import ConfirmModal from "../../../../Modals/ConfirmModal";
interface Props {
  modalCrud: string;
  tableValue: ClientInterface | null;
  onClose: () => void;
  onAddContact?: (contact: any) => void;
  cardValue: AddressInterface | null;
}

interface error {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
const ClientCrud: React.FC<Props> = ({ modalCrud, tableValue, onClose }) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().min(4).messages({
      "string.min": "Name must be at least 6 characters long",
      "string.empty": "Full name is a required field",
    }),
    lastName: Joi.string().min(4).messages({
      "string.min": "Name must be at least 6 characters long",
      "string.empty": "Full name is a required field",
    }),
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } })
      .messages({
        "string.email": "Invalid email",
        "string.empty": "Email is a required field",
      }),
    phone: Joi.string()
      .required()
      .custom((value) => {
        if (!isValidPhoneNumber(value, "DO")) {
          throw new Error("");
        }
        if (isEmpty(value)) return value;
        return parsePhoneNumber(value, "DO").nationalNumber;
      }, "libphonenumber validation")
      .messages({
        "any.custom": "The phone is not valid",
        "string.empty": "Phone is a required field",
      }),
  });

  const [modalOption, setModalOption] = useState<string>("");
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [cardValue, setCardValue] = useState<AddressInterface | null>(null);
  const [filteredItems, setFilteredItems] = useState<AddressInterface[]>([]);
  const [openMapAddressSelector, setOpenMapAddressSelector] = useState<boolean>(false);

  const [errors, setErrors] = useState<error>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  useEffect(() => {
    setModalOption(modalCrud);

    const addressList = map(get(tableValue, "addresses", []), (item, index) => ({
      order: index,
      ...item,
    }));

    setLastName(get(tableValue, "firstName", ""));
    setFirstName(get(tableValue, "lastName", ""));
    setPhone(get(tableValue, "email", "") || "");
    setEmail(get(tableValue, "phone", "") || "");
    setNote(get(tableValue, "note", "") || "");
    setFilteredItems(addressList);
  }, [tableValue]);

  const addressSelectHandler = (currentAddressData: AddressInterface, modeCard: string) => {
    let addressOrder = [];
    if (modeCard === "Edit") {
      const itemAll = reject(filteredItems, { order: currentAddressData.order });
      addressOrder = orderBy([...itemAll, currentAddressData], ["order"], ["asc"]);
    } else {
      const orderMax = get(maxBy(filteredItems, "order"), "order", 1) + 1;
      addressOrder = orderBy([...filteredItems, { ...currentAddressData, order: orderMax }], ["order"], ["asc"]);
    }
    setFilteredItems(addressOrder);
    setOpenMapAddressSelector(false);
  };
  const cancelModal = () => {
    onClose();
  };

  const handlerSaved = async () => {
    const validation = schema.validate({ firstName, lastName, email, phone }, { abortEarly: false });

    if (validation.error) {
      const { details } = validation.error;
      let errorsVal = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      };
      map(details, (item) => {
        errorsVal = { ...errorsVal, [get(item, "context.key", "")]: item.message };
      });
      setErrors(errorsVal);
    } else {
      const dataAdresses = map(filteredItems, (item) => {
        return {
          city: item.city,
          zone: item.zone,
          title: item.title,
          sector: item.sector,
          street: item.street,
          latitude: item.latitude,
          longitude: item.longitude,
          province: item.province,
          postalCode: item.postalCode,
          streetNumber: item.streetNumber,
          referenceToArrive: item.referenceToArrive,
        };
      });

      const data = {
        firstName: isEmpty(firstName) ? null : firstName,
        lastName: isEmpty(lastName) ? null : lastName,
        email: isEmpty(email) ? null : email,
        phone: isEmpty(phone) ? null : phone,
        note: isEmpty(note) ? null : note,
        addresses: dataAdresses,
      };
      if (modalOption === "Add") {
        axios
          .post("http://localhost:9000/client", data)
          .then((response) => {
            console.log("answer:", response.data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
      setErrors({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });
      onClose();
    }
  };

  const modalData = (name: string, item: AddressInterface | null): void => {
    setCardValue(item);
    setOpenMapAddressSelector(true);

    setModalOption(name);
  };
  const handleDeleteCard = (item: AddressInterface) => {
    const itemAll = reject(Array.isArray(filteredItems) ? filteredItems : [], { order: item.order });

    const addressList = map(itemAll, (item, index) => ({
      ...(item && typeof item === "object" ? item : {}),
      order: index,
    })) as AddressInterface[];

    setFilteredItems(addressList);
    setOpenConfirmModal(false);
  };

  const handleButtom = (name: string, item: AddressInterface): void => {
    switch (name) {
      case "Edit":
        modalData(name, item);
        break;

      case "Eraser":
        setOpenConfirmModal(true);
        setCardValue(item);

        break;

      case "Add":
        modalData(name, null);
        break;

      default:
        break;
    }
  };

  return (
    <Modal size="tiny" className={styles.modalFirst} open closeIcon onClose={cancelModal}>
      <Modal.Header className={styles.modalHeader}>
        <div className={styles.modalHeader}>
          {modalOption === "Watch" && <Icon name="eye" className={styles.headerIcon} />}
          {modalOption === "Edit" && <Icon name="edit" className={styles.headerIcon} />}
          {modalOption === "Add" && <Icon name="plus" className={styles.headerIcon} />}
          Cliente
          {modalOption !== "Add" && `- Id: ${String(get(tableValue, "idClient", ""))}`}
        </div>
        <div>
          {modalOption === "Watch" && (
            <Button
              onClick={() => {
                setModalOption("Edit");
              }}
              className={styles.modalButtonEdit}>
              <Icon name="edit" />
            </Button>
          )}

          {modalOption === "Edit" && (
            <Button
              onClick={() => {
                setModalOption("Watch");
              }}
              className={styles.modalButtonWatch}>
              <Icon name="eye" />
            </Button>
          )}
        </div>
      </Modal.Header>
      <Modal.Content className={styles.modalContent} scrolling>
        <Grid className={styles.container}>
          <Grid.Column mobile={16} tablet={16} computer={8} className={styles.columns}>
            <fieldset className={styles.firstfieldsetBasicInfo1}>
              <legend className={styles.legend}>
                <div className={styles.flexWidth}>
                  <Icon className={styles.icon} name="sliders horizontal" />
                  <div className={styles.titleBox}>Información básica</div>
                </div>
              </legend>
              <Form>
                <Text className={styles.textBox}>FirstName:</Text>

                <FormInput
                  value={firstName}
                  name="firstName"
                  icon="user"
                  disabled={modalOption === "Watch"}
                  required
                  fluid
                  error={
                    !isEmpty(errors.firstName) && {
                      content: errors.firstName,
                      pointing: "above",
                    }
                  }
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  className={styles.formInput}
                />
                <Text className={styles.textBox}>LastName:</Text>

                <FormInput
                  value={lastName}
                  name="lastName"
                  icon="user"
                  disabled={modalOption === "Watch"}
                  required
                  fluid
                  error={
                    !isEmpty(errors.lastName) && {
                      content: errors.lastName,
                      pointing: "above",
                    }
                  }
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  className={styles.formInput}
                />
                <Text className={styles.textBox}>E-Mail:</Text>

                <FormInput
                  name="email"
                  value={email}
                  icon="mail"
                  disabled={modalOption === "Watch"}
                  fluid
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className={styles.formInput}
                />
                <Text className={styles.textBox}>Phone:</Text>

                <FormInput
                  name="name"
                  value={phoneFormat(phone)}
                  icon="phone"
                  disabled={modalOption === "Watch"}
                  fluid
                  required
                  error={
                    !isEmpty(errors.phone) && {
                      content: errors.phone,
                      pointing: "above",
                    }
                  }
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                  className={styles.formInput}
                />

                <Text className={styles.textBox}>Note:</Text>
                <TextareaAutosize
                  disabled={modalOption === "Watch"}
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                  }}
                  className={styles.textArea}
                  rows={4}
                />
              </Form>
            </fieldset>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={16} computer={8} className={styles.columns}>
            <fieldset className={styles.firstfieldsetBasicInfo2}>
              <legend className={styles.legend}>
                <div className={styles.flexWidth}>
                  <Icon className={styles.icon} name="map marker alternate" />
                  <div className={styles.titleBox}>Dirección *</div>
                </div>
              </legend>
              <Form>
                <div className={styles.containerButtom}>
                  <Button
                    disabled={modalOption === "Watch"}
                    onClick={() => {
                      modalData("Add", null);
                    }}
                    color="blue">
                    Add Address
                  </Button>
                </div>
                <ListCardOrionRegister modalOption={modalOption === "Watch"} handleButtom={handleButtom} data={filteredItems} />
              </Form>
            </fieldset>
          </Grid.Column>
        </Grid>
      </Modal.Content>
      <Modal.Actions className={styles.modalFooter}>
        <Button className={styles.negativeButton} onClick={onClose}>
          Close
        </Button>
        {modalOption !== "Watch" && (
          <Button className={styles.positiveButton} onClick={handlerSaved}>
            {modalOption === "Add" ? "Guardar" : "Modificar"}
          </Button>
        )}
      </Modal.Actions>
      {openConfirmModal && (
        <ConfirmModal
          visible
          buttonLabel="Eraser"
          header="Confirm"
          content="Are you sure you want to delete the address?"
          focus={get(cardValue, "title", "")}
          onConfirm={() => {
            if (cardValue !== null) {
              handleDeleteCard(cardValue);
            }
          }}
          onDismiss={() => {
            setOpenConfirmModal(false);
          }}
        />
      )}
      {openMapAddressSelector && (
        <MapAddressSelector
          cardValue={cardValue || ({} as AddressInterface)}
          modalCrud={modalOption}
          onSelect={addressSelectHandler}
          onClose={() => {
            setOpenMapAddressSelector(false);
          }}
        />
      )}
    </Modal>
  );
};

export default ClientCrud;
