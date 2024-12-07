"use client";

import { useQueryState } from "nuqs";

export const useCreateWorkspaceModal = () => {
  const [isOpen, setIsOpen] = useQueryState("create-workspace", {
    parse: (v) => !!v,
    defaultValue: false,
  });

  return {
    setIsOpen,
    isOpen,
  };
};
