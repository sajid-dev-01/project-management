"use client";

import { useQueryState } from "nuqs";

export const useCreateProjectModal = () => {
  const [isOpen, setIsOpen] = useQueryState("create-project", {
    parse: (v) => !!v,
    defaultValue: false,
  });

  return {
    setIsOpen,
    isOpen,
  };
};
