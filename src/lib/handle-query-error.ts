import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { ValidationError } from "./errors";

export const handleQueryError = (error: any, form: UseFormReturn<any>) => {
  let err = error;
  if ("message" in err) {
    err = err as Error;
    toast.error(err.message);
  }

  if ("error" in err) {
    err = err.error as ValidationError;
    Object.keys(err.fieldErrors || {}).forEach((key) => {
      form.setError(key as any, {
        message: (err.fieldErrors as any)[key][0],
      });
    });
  }
};
