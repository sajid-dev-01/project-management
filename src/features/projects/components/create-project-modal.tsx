"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui-extension/modal";

import { useCreateProjectModal } from "../hooks/use-create-project-modal";
import { CreateProjectForm } from "./create-project-form";

export const CreateProjectModal = () => {
  const { isOpen, setIsOpen } = useCreateProjectModal();

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle className="text-xl">Create a new project</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <CreateProjectForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
