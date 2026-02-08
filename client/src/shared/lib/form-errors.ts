import { UseFormSetError, FieldValues, Path } from "react-hook-form";

interface BackendErrorResponse {
  message?: string;
  errors?: Record<string, string | string[]>;
}

export const handleFormErrors = <T extends FieldValues>(
  error: any,
  setError: UseFormSetError<T>
) => {
  if (error?.response?.data) {
    const data = error.response.data as BackendErrorResponse;

    // Handle field-specific errors
    if (data.errors) {
      Object.entries(data.errors).forEach(([field, message]) => {
        const errorMessage = Array.isArray(message) ? message[0] : message;
        setError(field as Path<T>, {
          type: "server",
          message: errorMessage,
        });
      });
    }
  }
};
