import React, { ReactNode } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

type ModalWrapperProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmButtonText?: string;
  confirmButtonColorScheme?: string;
  onConfirm?: () => void; // Optional callback for confirm action
  isLoading?: boolean;
  hideConfirmButton?: boolean; // Option to hide the confirm button
};

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  title,
  children,
  confirmButtonText = "Confirm",
  confirmButtonColorScheme = "blue",
  onConfirm,
  isLoading = false,
  hideConfirmButton = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          {!hideConfirmButton && onConfirm && (
            <Button
              colorScheme={confirmButtonColorScheme}
              mr={3}
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {confirmButtonText}
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
