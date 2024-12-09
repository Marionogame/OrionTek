import React from "react";
import { Card, Button, Icon, CardGroup } from "semantic-ui-react";

import { AddressInterface } from "../../../../Interface/Client";
import { map, get } from "lodash";
import styles from "./styles.module.css";

interface ListCardOrionRegister {
  data: AddressInterface[] | [];
  handleButtom: (name: string, item: AddressInterface) => void;
  modalOption: boolean;
}

const TableOrion: React.FC<ListCardOrionRegister> = ({ data, modalOption, handleButtom }) => {
  const handleCard = (data: AddressInterface[]) => {
    const listToRender = map(data, (address, key) => {
      return (
        <Card fluid className={styles.cardCont} index={key}>
          <Card.Content>
            <Card.Header>{`${address.title}`}</Card.Header>
            <Card.Meta>
              <span className="date">Id# {String(key + 1)}</span>
            </Card.Meta>
            <Card.Description>
              <p>
                <strong>City:</strong> {get(address, "city", "")}
              </p>
              <p>
                <strong>Zone:</strong> {get(address, "zone", "")}
              </p>
              <p>
                <strong>Sector:</strong> {get(address, "sector", "")}
              </p>
              <div className={styles.line} />
              <p>
                <strong>Street:</strong> {get(address, "street", "")}
              </p>
              <p>
                <strong>StreetNumber:</strong> {get(address, "streetNumber", "")}
              </p>
              <p>
                <strong>PostalCode:</strong> {get(address, "postalCode", "")}
              </p>
              <p>
                <strong>Province:</strong> {get(address, "province", "")}
              </p>
              <p>
                <strong>Lat:</strong> {String(get(address, "latitude", ""))}
              </p>
              <p>
                <strong>Long:</strong> {String(get(address, "longitude", ""))}
              </p>
              <div className={styles.line} />
              <div className={styles.textBottom}>
                <strong>Reference To Arrive:</strong>
              </div>{" "}
              <p className={styles.contText}>{get(address, "referenceToArrive", "")}</p>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div className={styles.contButtonGroup}>
              <div className={styles.contButton}>
                <Button disabled={modalOption} className={styles.buttom} onClick={() => handleButtom("Edit", address)} size="small" color="green">
                  <Icon name="edit" /> Edit
                </Button>

                <Button disabled={modalOption} className={styles.buttom} onClick={() => handleButtom("Eraser", address)} size="small" color="red">
                  <Icon name="trash" /> Delete
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      );
    });

    return <CardGroup>{listToRender}</CardGroup>;
  };
  return <div>{handleCard(data)}</div>;
};

export default TableOrion;
