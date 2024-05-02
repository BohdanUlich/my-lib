import { CATEGORY_TYPE, CODE_ITEM_TYPE } from "./constants";

export interface User {
  id: string;
  email: string;
  name?: string;
  password?: string;
}

export interface Category {
  id: string;
  name: string;
  user_id: string;
  labels?: Label[];
}

export interface Label {
  id: string;
  name: string;
  user_id: string;
  category_ids?: string[];
  color: string;
  type: string;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code: number;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export type LabelType = typeof CATEGORY_TYPE | typeof CODE_ITEM_TYPE;
