import React from "react";
import { TableRow, TableHeaderCell, TableHeader, TableFooter, TableCell, TableBody, MenuItem, Icon, Menu, Table, Button } from "semantic-ui-react";
import { ClientInterface } from "../../../../Interface/Client";
import { get } from "lodash";

import styles from "./styles.module.css";

interface TableOrionProps {
  data: ClientInterface[];
  handleButtom: (name: string, item: ClientInterface | null) => void;
}

const TableOrion: React.FC<TableOrionProps> = ({ data, handleButtom }) => {
  return (
    <div className={styles.container}>
      <div className={styles.containerButtom}>
        <Button onClick={() => handleButtom("Add", null)} color="blue">
          Add Item
        </Button>
      </div>
      <Table celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Action</TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Phone</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Address</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((client) => (
            <TableRow key={client.ClientId}>
              <TableCell>
                <Button className={styles.buttom} onClick={() => handleButtom("Eraser", client)} size="small" color="red">
                  Del
                </Button>

                <Button className={styles.buttom} onClick={() => handleButtom("Edit", client)} size="small" color="green">
                  Edit
                </Button>
              </TableCell>

              <TableCell>{`${client.firstName} ${client.lastName}`}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.email || "N/A"}</TableCell>
              <TableCell>
                {client.defaultAddress
                  ? `${get(client, "defaultAddress.title", "")},${get(client, "defaultAddress.street", "")},${get(
                      client,
                      "defaultAddress.zone",
                      ""
                    )},${get(client, "defaultAddress.city", "")},${get(client, "defaultAddress.province", "")}`
                  : "No address available"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableHeaderCell colSpan="5">
              <Menu floated="right" pagination>
                <MenuItem as="a" icon>
                  <Icon name="chevron left" />
                </MenuItem>
                <MenuItem as="a">1</MenuItem>
                <MenuItem as="a">2</MenuItem>
                <MenuItem as="a">3</MenuItem>
                <MenuItem as="a">4</MenuItem>
                <MenuItem as="a" icon>
                  <Icon name="chevron right" />
                </MenuItem>
              </Menu>
            </TableHeaderCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default TableOrion;
