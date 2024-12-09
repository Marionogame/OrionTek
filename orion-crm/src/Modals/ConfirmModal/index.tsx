import React from "react";
import { Modal, Button } from "semantic-ui-react";
import { isEmpty } from "lodash";

// Styles
import styles from "./styles.module.css";

interface ConfirmModalProps {
  visible: boolean;
  content?: string;
  header?: string;
  buttonLabel?: string;
  focus?: string;
  onConfirm: () => void;
  onDismiss: () => void;
  dismissButton?: boolean;

  headerColor?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  content,
  header,
  buttonLabel = "Confirmar",
  focus,
  onConfirm,
  onDismiss,
  dismissButton = true,

  headerColor,
}) => {
  return (
    <Modal open={visible} size="tiny" closeOnDimmerClick={false} dimmer="blurring">
      <Modal.Header className={styles.header} style={!isEmpty(headerColor) ? { color: "red" } : { color: "hsl(232, 50%, 50%)" }}>
        {` ${header}`}
      </Modal.Header>
      {!isEmpty(content) && (
        <Modal.Content>
          <div className={styles.content}>
            {`¿${content}`} <span className={styles.focus}>{focus}</span>
            <span>?</span>
          </div>
        </Modal.Content>
      )}
      <Modal.Actions className={styles.actions}>
        {dismissButton && (
          <Button className={styles.negativeButton} onClick={onDismiss}>
            Atrás
          </Button>
        )}

        <Button className={styles.positiveButton} onClick={onConfirm}>
          {buttonLabel}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ConfirmModal;
