import { ErrorOption } from "react-hook-form";

interface ErrorObject {
  message: string;
  source: string;
}

export type SetError = (name: string, error: ErrorOption) => void;

export const setFormErrors = (errors: ErrorObject[], setError: SetError) => {
  if (Array.isArray(errors)) {
    errors.forEach((error) => {
      setError(error.source, { message: error.message });
    });
  }
};
