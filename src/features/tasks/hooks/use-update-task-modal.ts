"use client";

import { parseAsString, useQueryState } from "nuqs";

export const useUpdateTaskModal = () => {
  const [updateTaskId, setUpdateTaskId] = useQueryState(
    "update-task",
    parseAsString
  );

  return {
    updateTaskId,
    setUpdateTaskId,
  };
};
