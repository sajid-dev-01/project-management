"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui-extension/modal";

import { useUpdateTaskModal } from "../hooks/use-update-task-modal";
import { UpdateTaskWrapper } from "./update-task-modal-wrapper";

export const UpdateTaskModal = () => {
  const { updateTaskId, setUpdateTaskId } = useUpdateTaskModal();

  return (
    <Modal open={!!updateTaskId} onOpenChange={() => setUpdateTaskId(null)}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle className="text-xl">Update task</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {updateTaskId && (
            <UpdateTaskWrapper taskId={updateTaskId} onCancel={close} />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
