import React, { useState, useEffect } from "react";
import TableOrion from "./Components/TableOrion";
import ListCardOrion from "./Components/ListCardOrion";
import axios from "axios";

import ConfirmModal from "../../Modals/ConfirmModal";
import { ClientInterface } from "../../Interface/Client";
import ClientCrud from "./Modals/ClientCrud";
import { Header } from "semantic-ui-react";
import styles from "./styles.module.css";

interface ClientsProps {}

const Clients: React.FC<ClientsProps> = () => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openClientCrud, setOpenClientCrud] = useState(false);
  const [tableValue, setTableValue] = useState<ClientInterface | null>(null);
  const [allItem, setAllItem] = useState<ClientInterface[] | []>([]);
  const [modalOption, setModalOption] = useState<string>("");
  const [isMovil, setIsMovil] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:9000/client/all");
        setAllItem(response.data.data);
      } catch (err) {
      } finally {
      }
    };
    // setTableValue();
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMovil(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const modalData = (name: string, item: ClientInterface | null): void => {
    setModalOption(name);
    setOpenClientCrud(true);
    setTableValue(item);
  };

  const apiData = async (name: string): Promise<void> => {
    switch (name) {
      case "Edit":
        setOpenClientCrud(false);
        break;

      case "Eraser":
        setOpenConfirmModal(false);
        if (tableValue && tableValue.ClientId) {
          axios
            .delete("http://localhost:9000/client", {
              data: { ClientId: tableValue.ClientId },
            })
            .then((response) => {
              console.log("Recurso eliminado:", response.data);
            })
            .catch((error) => {
              console.error("Error al borrar el recurso:", error.response ? error.response.data : error.message);
            });
        }
        break;
      default:
        break;
    }
  };

  // Table handlers
  const handleButtom = (name: string, item: ClientInterface | null): void => {
    switch (name) {
      case "Watch":
        modalData(name, item);
        break;

      case "Edit":
        modalData(name, item);
        break;

      case "Eraser":
        setOpenConfirmModal(true);
        setTableValue(item);
        break;

      case "Add":
        modalData(name, null);
        break;

      default:
        break;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerTableGroup}>
        <div className={styles.titleContainer}>
          <Header as="h1" className={styles.title}>
            OrionTek Client CRM
          </Header>
        </div>
        {isMovil ? <TableOrion handleButtom={handleButtom} data={allItem} /> : <ListCardOrion handleButtom={handleButtom} data={allItem} />}
      </div>

      {openClientCrud && (
        <ClientCrud
          tableValue={tableValue}
          onClose={() => {
            setOpenClientCrud(false);
          } }
          modalCrud={modalOption} cardValue={null}        />
      )}
      {openConfirmModal && (
        <ConfirmModal
          visible
          buttonLabel="Eraser"
          header="Confirmar"
          content="Are you sure you want to delete the address?"
          focus={tableValue?.firstName}
          onConfirm={() => {
            apiData("Eraser");
          }}
          onDismiss={() => {
            setOpenConfirmModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Clients;
