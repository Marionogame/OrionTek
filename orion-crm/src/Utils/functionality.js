import moment from "moment";
import { map, isEmpty, xorWith, isEqual, get, has } from "lodash";
import Compressor from "compressorjs";

moment.locale("es-do");

export const isArrayEqual = (x, y) => {
  return isEmpty(xorWith(x, y, isEqual));
};

export const getExcludingNulls = (object, path, defaultValue) => {
  const temp = get(object, path, defaultValue);
  return temp === null ? defaultValue : temp;
};

export const guidGenerator = () => {
  const S4 = () => {
    // eslint-disable-next-line no-bitwise
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
};

export const compressImage = (image) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-new
    new Compressor(image, {
      quality: 0.6,
      maxHeight: 1024,
      maxWidth: 1024,
      success(result) {
        resolve(result);
      },
      error(err) {
        reject(err);
      },
    });
  });
};

export const buildURLQuery = (obj) => {
  Object.entries(obj)
    .map((pair) => {
      return pair.map(encodeURIComponent).join("=");
    })
    .join("&");
};

export const getTimeStamp = () => {
  return moment().valueOf();
};

export const getTimeLabel = (time, format) => {
  if (time) {
    return moment(time).format(format);
  }
  return "";
};

export const getValidationErrors = (validation, defaultErrors) => {
  const { details } = validation.error;
  let errors = defaultErrors;
  map(details, (item) => {
    errors = { ...errors, [item.context.key]: item.message };
  });
  return errors;
};

export function currencyFormat(num, integer = false, widthZero = false, nullToZero = false) {
  const moneyInstance = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "dop",
  });

  if ([null, "", undefined].includes(num) && !nullToZero) return "";
  if (!widthZero && parseFloat(num || 0) === 0) return "";
  const strNum = moneyInstance.format(num).replace("DOP", "");
  if (integer) return strNum.split(".")[0];
  return strNum;
}

export function timeBetweenDates(time, timeEnd) {
  const today = new Date(time);
  let endDate = new Date();
  if (!isEmpty(time)) {
    if (!isEmpty(timeEnd)) {
      endDate = new Date(timeEnd);
    }
    const days = parseInt((endDate - today) / (1000 * 60 * 60 * 24), 10);
    const hours = parseInt((Math.abs(today - endDate) / (1000 * 60 * 60)) % 24, 10);
    const minutes = parseInt((Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60)) % 60, 10);
    const seconds = parseInt((Math.abs(endDate.getTime() - today.getTime()) / 1000) % 60, 10);

    let timeString = "";
    if (days === 0) {
      if (hours === 0) {
        if (minutes === 0) {
          timeString = `${String(seconds)}s`;
        } else {
          timeString = `${String(minutes)}m  ${String(seconds)}s`;
        }
      } else {
        timeString = `${String(hours)}h  ${String(minutes)}m  ${String(seconds)}s`;
      }
    } else {
      timeString = `${String(days)}d  
				${String(hours)}h  
				${String(minutes)}m  
				${String(seconds)}s`;
    }
    return timeString;
  }
  return "";
}

export const stateSetter = (namedData, dataInput, setFunctions, clearErrors) => {

  let dataToSet = namedData;
  let errorToClear = "";
  if (!isEmpty(dataInput)) {
    const { name, value } = dataInput;
    errorToClear = name;
    dataToSet = { [name]: value };
  }

  if (!isEmpty(clearErrors) && !isEmpty(errorToClear)) {
    const { errors, setErrors } = clearErrors;
    setErrors({ ...errors, [errorToClear]: "" });
  }

  const dataToSetKeys = Object.keys(dataToSet);
  if (dataToSetKeys.length === 1) {
    const key = dataToSetKeys[0];
    const setFunction = setFunctions[key];
    setFunction(dataToSet[key]);
  } else {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in dataToSet) {
      if (has(dataToSet, key) && has(setFunctions, key)) {
        const setFunction = setFunctions[key];
        setFunction(dataToSet[key]);
      }
    }
  }
};
