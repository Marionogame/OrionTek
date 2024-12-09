/* eslint-disable */
import React, { FC, useRef } from "react";
import { Form, Button, Icon, SemanticICONS } from "semantic-ui-react";
import { usePlacesWidget } from "react-google-autocomplete";
import { isEmpty, omit } from "lodash";

// Styles
import styles from "./styles.module.css";

interface AddressInputProps {
  type: string;
  apiKey: string;
  getgeometry: (lat: number, lon: number) => void;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLButtonElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  icon?: SemanticICONS;
  className?: string;
  rounded?: boolean;
  [key: string]: any; // For additional props
}

const AddressInput: FC<AddressInputProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  usePlacesWidget({
    apiKey: props.apiKey,
    options: {
      fields: ["formatted_address", "geometry.location"],
      componentRestrictions: { country: "do" },
      types: [props.type],
      debounce: 1000,
    },
    onPlaceSelected: (place) => {
      if (!isEmpty(place.geometry)) {
        const lat = place.geometry.location.lat();
        const lon = place.geometry.location.lng();
        props.getgeometry(lat, lon);
        props.onChange({
          target: { name: props.name, value: place.formatted_address },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    },
  });

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const clearInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onChange({
      ...e,
      target: { name: props.name, value: "" },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const { name, onKeyPress, value, onChange, disabled, icon, className, rounded, ...restProps } = props;

  const validProps = omit(restProps, ["icon", "children", "getgeometry", "onKeyPress", "name", "value", "onChange", "disabled", "className", "rounded"]);

  return (
    <Form.Input
      {...validProps}
      className={`${styles.input} ${className}`}
      disabled={disabled}
      onChange={onChange}
      name={name}
      value={value}
      iconPosition="left"
      autoComplete="off"
      fluid
      onKeyPress={onKeyPress ? onKeyPress : handleEnter}
      action>
      <Icon name={icon} />
      <input ref={inputRef} />
      {!isEmpty(value) && !disabled && (
        <Button className={rounded ? styles.clearRoundedIconLast : styles.clearIconLast} icon="cancel" onClick={clearInput}></Button>
      )}
    </Form.Input>
  );
};

export default AddressInput;
