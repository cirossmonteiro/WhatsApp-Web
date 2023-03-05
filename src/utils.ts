import { TColor } from "./interfaces";

export const addLeadingZeros = (s: string, totalLength: number) => s.padStart(totalLength, '0');

export const rgbObjToHex = (value: TColor) => {
  const hexRed = addLeadingZeros(value.red.toString(16), 2),
        hexGreen = addLeadingZeros(value.green.toString(16), 2),
        hexBlue = addLeadingZeros(value.blue.toString(16), 2);
  return `#${hexRed}${hexGreen}${hexBlue}`;
}

export const rgbArrToHex = (value: [number, number, number]) => {
  return rgbObjToHex({ red: value[0], green: value[1], blue: value[2] });
}