"use client";

import { Category } from "@/types";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface CategoriesContextType {
  currentCategories: Category[];
  setCurrentCategories: Dispatch<SetStateAction<Category[]>>;
}

const CategoriesContext = createContext<CategoriesContextType>({
  currentCategories: [],
  setCurrentCategories: () => {},
});

export const useCategories = () => useContext(CategoriesContext);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [currentCategories, setCurrentCategories] = useState<Category[]>([]);

  return (
    <CategoriesContext.Provider
      value={{ currentCategories, setCurrentCategories }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
