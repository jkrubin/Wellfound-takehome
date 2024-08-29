import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useDisclosure,
  useColorModeValue,
  Spacer,
} from "@chakra-ui/react";
import { Candidate } from "../../Api/Candidate/types";
import { useCandidateContext } from "../../Api/Candidate";
import { ModalWrapper } from "../Modal";

type CandidateDisplayProps = {
  candidate: Candidate;
};

const CandidateDisplay: React.FC<CandidateDisplayProps> = ({ candidate }) => {
  const { updateCandidate, deleteCandidate } = useCandidateContext();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [editName, setEditName] = useState(candidate.name);
  const [editEmail, setEditEmail] = useState(candidate.email);
  const [loading, setLoading] = useState(false);

  const handleUpdateCandidate = async () => {
    setLoading(true);
    try {
      await updateCandidate(candidate.id, editName, editEmail);
      onEditClose();
    } catch (error) {
      console.error("Error updating candidate:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async () => {
    setLoading(true);
    try {
      await deleteCandidate(candidate.id);
      onDeleteClose();
    } catch (error) {
      console.error("Error deleting candidate:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg={useColorModeValue("white", "gray.700")}
    >
      <Heading fontSize="xl">{candidate.name}</Heading>
      <Text mt={4}>{candidate.email}</Text>
      <Stack mt={4} direction="row" spacing={4}>
        <Spacer />
        <Button colorScheme="blue" onClick={onEditOpen}>
          Edit
        </Button>
        <Button colorScheme="red" onClick={onDeleteOpen}>
          Delete
        </Button>
      </Stack>

      <ModalWrapper
        isOpen={isEditOpen}
        onClose={onEditClose}
        title="Edit Candidate"
        confirmButtonText="Update"
        confirmButtonColorScheme="blue"
        onConfirm={handleUpdateCandidate}
        isLoading={loading}
      >
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        </FormControl>
        <FormControl id="email" mt={4} isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
          />
        </FormControl>
      </ModalWrapper>

      <ModalWrapper
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        title="Delete Candidate"
        confirmButtonText="Delete"
        confirmButtonColorScheme="red"
        onConfirm={handleDeleteCandidate}
        isLoading={loading}
      >
        <Text>
          Are you sure you want to delete this candidate? This action cannot be
          undone.
        </Text>
      </ModalWrapper>
    </Box>
  );
};

export default CandidateDisplay;
