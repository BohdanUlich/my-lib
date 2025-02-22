import { CATEGORY_TYPE, CODE_ITEM_TYPE } from "./constants";

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

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

export interface CategoriesListResponse {
  data: Category[];
  pagination: Pagination;
}

export interface CodeItem {
  id: string;
  name: string;
  description?: string;
  code?: string;
  category_id: string;
  user_id: string;
  labels?: Label[];
  label_ids?: string[];
  language: string;
}

export interface CodeItemsListResponse {
  data: CodeItem[];
  pagination: Pagination;
  pageTitle: string;
}

export interface Label {
  id: string;
  name: string;
  user_id: string;
  color: string;
  type: string;
  text_color: string;
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

export interface Image {
  url: string;
  name: string;
}

export interface MongoError {
  code?: number;
  message: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export type LabelType = typeof CATEGORY_TYPE | typeof CODE_ITEM_TYPE;
