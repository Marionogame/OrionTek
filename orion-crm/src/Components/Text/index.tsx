import React from "react";
import { Header } from "semantic-ui-react";

// Styles
import styles from "./styles.module.css";

type TextProps = {
  text?: string;
  children?: React.ReactNode;
  className?: string | string[];
  as?: string;
  href?: string;
  disabled?: boolean;
  style?: string | React.CSSProperties;
  onClick?: () => void;
};

const Text: React.FC<TextProps> = ({ children = "", className, as, href, disabled = false, style, text, onClick }) => {
  const renderChild = (child: React.ReactNode): React.ReactNode => {
    if (typeof child === "string") {
      if (child.includes("\n")) {
        return child
          .split("\n")
          .filter((item) => item !== "\r")
          .map((item, index) => (
            <div key={index}>
              {item.replace(/(?:\\[rn])+/g, "")}
              {(item.match(/(?:\\[n])/g) || []).map((_, i) => (
                <br key={i} />
              ))}
            </div>
          ));
      }
      return child;
    }
    return child;
  };

  return (
    <Header as={as || "h5"} className={`${styles.text} ${className}`} href={href} disabled={disabled} style={style} onClick={onClick}>
      {renderChild(children || text)}
    </Header>
  );
};

export default Text;
