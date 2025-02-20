import { DARK_TEXT } from "@/types";

interface GetTextColorParams {
  textColor: string;
}

export const getTextColor = ({ textColor }: GetTextColorParams) => {
  return textColor === DARK_TEXT ? "#000" : "#fff";
};
