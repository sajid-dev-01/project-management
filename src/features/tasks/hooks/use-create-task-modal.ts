import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";

import { TaskStatus } from "@/db/schema";

export const useCreateTaskModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const [taskStatus, setTaskStatus] = useQueryState(
    "task-status",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true })
  );

  const open = (type: TaskStatus | "" = "") => {
    setIsOpen(true);
    setTaskStatus(type);
  };

  const close = () => {
    setIsOpen(false);
    setTaskStatus("");
  };

  const setModalState = (value: boolean) => {
    setIsOpen(value);
    if (!value) setTaskStatus("");
  };

  return {
    isOpen,
    setIsOpen,
    taskStatus,
    open,
    close,
    setModalState,
  };
};
