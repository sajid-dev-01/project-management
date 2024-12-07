"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui-extension/modal";

import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { CreateTaskWrapper } from "./create-task-modal-wrapper";

export const CreateTaskModal = () => {
  const { isOpen, setIsOpen, close } = useCreateTaskModal();

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle className="text-xl">Create a new task</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <CreateTaskWrapper onCancel={close} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
