import React from "react";
import { CardMeta, CardHeader, CardGroup, CardDescription, CardContent, Button, Card } from "semantic-ui-react";
import { ClientInterface } from "../../../../Interface/Client";
import { map, get } from "lodash";
import styles from "./styles.module.css";

interface TableOrionProps {
  data: ClientInterface[];
  handleButtom: (name: string, item: ClientInterface) => void;
}

const TableOrion: React.FC<TableOrionProps> = ({ data, handleButtom }) => {
  const handleCard = (data: ClientInterface[]) => {
    const listToRender = map(data, (client, key) => {
      return (
        <Card index={key}>
          <CardContent>
            <div className={styles.contButton}>
              <CardHeader>{client.firstName}</CardHeader>
              <Button onClick={() => handleButtom("Add", client)} basic color="blue">
                Add
              </Button>
            </div>
            <CardMeta>{client.phone}</CardMeta>
            <CardMeta>{client.email || "N/A"}</CardMeta>
            <CardDescription>
              {client.defaultAddress
                ? `${get(client, "defaultAddress.title", "")},${get(client, "defaultAddress.street", "")},${get(client, "defaultAddress.zone", "")},${get(
                    client,
                    "defaultAddress.city",
                    ""
                  )},${get(client, "defaultAddress.province", "")}`
                : "No address available"}
            </CardDescription>
          </CardContent>
          <CardContent extra>
            <div className="ui two buttons">
              <Button onClick={() => handleButtom("Eraser", client)} basic color="red">
                Delete
              </Button>
              <Button onClick={() => handleButtom("Edit", client)} basic color="green">
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    });

    return <CardGroup>{listToRender}</CardGroup>;
  };
  return <div>{handleCard(data)}</div>;
};

export default TableOrion;
