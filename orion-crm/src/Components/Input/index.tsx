// React
import React, { useEffect, useRef, forwardRef, useState } from "react";

// Libraries
import { Form, Button, Select, SelectProps } from "semantic-ui-react";
import { isEmpty, omit, isFunction } from "lodash";

// Styles
import styles from "./styles.module.css";

type InputProps = {
  isPassword?: boolean;
  name: string;
  value: string;
  className?: string;
  icon?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  rounded?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, data: { name: string; value: string }) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  dropdown?: SelectProps;
  required?: boolean;
  fluid?: boolean;
  error?: boolean | { content: string; pointing?: string };

  type?: string;
  onBlur?: (event?: React.FocusEvent<HTMLInputElement>) => void;
};

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    isPassword = false,
    name,
    value,
    className,
    icon,
    label,
    placeholder,
    disabled,
    rounded,
    onChange,
    onKeyPress,
    onClear,
    dropdown,
    required = false,
    fluid = true,
    type = "text",
    onBlur,
  } = props;

  const input = useRef<HTMLInputElement>(null);
  const combinedRef = (ref as React.RefObject<HTMLInputElement>) || input;
  const [isFocused, setIsFocused] = useState(false);
  const [inputType, setInputType] = useState(isPassword ? "password" : "text");
  const [passwordIcon, setPasswordIcon] = useState("eye slash");

  useEffect(() => {
    if (rounded) {
      const inputElement = combinedRef.current;
      if (!inputElement) return;

      if (isEmpty(value) || disabled) {
        inputElement.style.removeProperty("border-top-left-radius");
        inputElement.style.removeProperty("border-bottom-left-radius");
        inputElement.style.removeProperty("border-top-right-radius");
        inputElement.style.removeProperty("border-bottom-right-radius");
        inputElement.style.removeProperty("border-right");
        if (!isPassword) {
          inputElement.style.setProperty("border-radius", "1rem", "important");
          inputElement.style.setProperty("border-right", `1px solid ${isFocused ? "var(--inputFocus)" : "var(--inputShader)"}`, "important");
        } else {
          inputElement.style.setProperty("border-top-left-radius", "1rem", "important");
          inputElement.style.setProperty("border-bottom-left-radius", "1rem", "important");
        }
      } else {
        inputElement.style.removeProperty("border-radius");
        inputElement.style.setProperty("border-top-left-radius", "1rem", "important");
        inputElement.style.setProperty("border-bottom-left-radius", "1rem", "important");
        inputElement.style.setProperty("border-top-right-radius", "0", "important");
        inputElement.style.setProperty("border-bottom-right-radius", "0", "important");
        inputElement.style.setProperty("border-right", "0", "important");
      }
    } else {
      const inputElement = combinedRef.current;
      if (!inputElement) return;

      if (isEmpty(value) || disabled) {
        inputElement.style.setProperty("border-radius", "0.25rem", "important");
        if (!isPassword) {
          inputElement.style.setProperty("border-right", `1px solid ${isFocused ? "var(--inputFocus)" : "var(--inputShader)"}`, "important");
        } else {
          inputElement.style.setProperty("border-right", "0", "important");
          inputElement.style.setProperty("border-top-right-radius", "0", "important");
          inputElement.style.setProperty("border-bottom-right-radius", "0", "important");
        }
      } else {
        inputElement.style.setProperty("border-right", "0", "important");
        inputElement.style.setProperty("border-top-right-radius", "0", "important");
        inputElement.style.setProperty("border-bottom-right-radius", "0", "important");
      }
    }
    if (!isEmpty(dropdown)) {
      const inputElement = combinedRef.current;
      if (!inputElement) return;

      inputElement.style.setProperty("border-top-left-radius", "0", "important");
      inputElement.style.setProperty("border-bottom-left-radius", "0", "important");
      inputElement.style.setProperty("border-left-color", "transparent", "important");
    }
  }, [value, isFocused, rounded, disabled, dropdown, isPassword, combinedRef]);

  const trimValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = { name, value: e.target.value.trim() };
    onChange(e, data);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    if (onKeyPress) {
      trimValue(e as unknown as React.ChangeEvent<HTMLInputElement>);
      onKeyPress(e);
      return;
    }
    if (key === "Enter") {
      e.preventDefault();
      trimValue(e as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleToggle = () => {
    const toggle = inputType === "password";
    setInputType(toggle ? "text" : "password");
    setPasswordIcon(toggle ? "eye" : "eye slash");
  };

  const clearInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    const data = { name, value: "" };
    onChange(e as unknown as React.ChangeEvent<HTMLInputElement>, data);
    if (onClear) {
      onClear();
    }
  };

  const onFocus = () => {
    setIsFocused(true);
  };

  const defaultOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    trimValue(e as unknown as React.ChangeEvent<HTMLInputElement>);
    setIsFocused(false);
    if (isFunction(onBlur)) {
      onBlur(e);
    }
  };

  const getActionStyle = () => {
    if (isPassword) {
      return isFocused ? styles.clearIconFocused : styles.clearIcon;
    }
    if (rounded) {
      return isFocused ? styles.clearRoundedIconLastFocused : styles.clearRoundedIconLast;
    }
    return isFocused ? styles.clearIconLastFocused : styles.clearIconLast;
  };

  const validProps = omit(props, [
    "ref",
    "icon",
    "children",
    "onKeyPress",
    "name",
    "value",
    "onChange",
    "onClear",
    "disabled",
    "className",
    "rounded",
    "isPassword",
    "required",
    "type",
  ]);

  return (
    <Form.Input
      {...(validProps as any)}
      className={`${styles.input} ${className}`}
      disabled={disabled}
      onChange={onChange}
      name={name}
      required={required}
      label={label}
      placeholder={isEmpty(placeholder) ? label : placeholder}
      value={value}
      type={isPassword ? inputType : type}
      {...(isEmpty(dropdown) ? { iconPosition: "left" } : {})}
      autoComplete="off"
      fluid={fluid}
      onFocus={onFocus}
      onBlur={defaultOnBlur}
      onKeyPress={handleEnter}
      action>
      {!isEmpty(dropdown) && <Select labeled {...dropdown} />}
      <input ref={combinedRef} />

      {!isEmpty(value) && !disabled && <Button className={getActionStyle()} icon="cancel" onClick={clearInput} tabIndex={-1} />}

      {isPassword && (
        <Button className={rounded ? styles.clearRoundedIconLast : styles.clearIconLast} icon={passwordIcon} onClick={handleToggle} tabIndex={-1} />
      )}
    </Form.Input>
  );
});

export default Input;
