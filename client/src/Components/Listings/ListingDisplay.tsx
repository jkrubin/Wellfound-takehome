import {
  Box,
  Heading,
  Text,
  Button,
  useDisclosure,
  Stack,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Spacer,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Listing } from "../../Api/Listing/types";
import { useCandidateContext } from "../../Api/Candidate";
import { useListingContext } from "../../Api/Listing";
import { useAuth } from "../../Api/Auth";
import { ModalWrapper } from "../Modal";

type ListingDisplayProps = {
  listing: Listing;
};
const ListingDisplay: React.FC<ListingDisplayProps> = ({ listing }) => {
  const { isAuth } = useAuth();
  const { candidates } = useCandidateContext();
  const { updateListing, deleteListing, assignToListing, unassignToListing } =
    useListingContext();
  const [loading, setLoading] = useState(false);
  const {
    isOpen: isAppliedOpen,
    onOpen: onAppliedOpen,
    onClose: onAppliedClose,
  } = useDisclosure();
  const {
    isOpen: isNotAppliedOpen,
    onOpen: onNotAppliedOpen,
    onClose: onNotAppliedClose,
  } = useDisclosure();
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

  const [editTitle, setEditTitle] = useState(listing.title);
  const [editDescription, setEditDescription] = useState(listing.description);

  const appliedCandidates = candidates.filter((candidate) =>
    listing.applicants.some((applications) => applications.id === candidate.id)
  );

  const notAppliedCandidates = candidates.filter(
    (candidate) =>
      !listing.applicants.some(
        (applications) => applications.id === candidate.id
      )
  );

  const handleApply = async (candidateId: number) => {
    await assignToListing(listing.id, candidateId);
  };

  const handleUnapply = async (candidateId: number) => {
    await unassignToListing(listing.id, candidateId);
  };

  const handleUpdateListing = async () => {
    setLoading(true);
    try {
      await updateListing(listing.id, editTitle, editDescription);
      onEditClose();
    } catch (error) {
      console.error("Error updating listing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async () => {
    setLoading(true);
    try {
      await deleteListing(listing.id);
      onDeleteClose();
    } catch (error) {
      console.error("Error deleting listing:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
      <Heading fontSize="xl">{listing.title}</Heading>
      <Text mt={4}>{listing.description}</Text>
      {isAuth === "TRUE" && (
        <Stack mt={4} direction="row" spacing={4}>
          <Button colorScheme="teal" onClick={onAppliedOpen}>
            Applied ({appliedCandidates.length})
          </Button>
          <Button colorScheme="orange" onClick={onNotAppliedOpen}>
            Candidates ({notAppliedCandidates.length})
          </Button>
          <Spacer />
          <Button colorScheme="blue" onClick={onEditOpen}>
            Edit
          </Button>
          <Button colorScheme="red" onClick={onDeleteOpen}>
            Delete
          </Button>
        </Stack>
      )}

      <ModalWrapper
        isOpen={isAppliedOpen}
        onClose={onAppliedClose}
        title="Applied Candidates"
        confirmButtonText="Close"
        confirmButtonColorScheme="teal"
        onConfirm={onAppliedClose}
      >
        <VStack spacing={4} align="stretch">
          {appliedCandidates.length > 0 ? (
            appliedCandidates.map((candidate) => (
              <Box
                key={candidate.id}
                p={4}
                shadow="sm"
                borderWidth="1px"
                borderRadius="md"
              >
                <Text fontWeight="bold">{candidate.name}</Text>
                <Text>{candidate.email}</Text>
                <Button
                  mt={2}
                  colorScheme="red"
                  onClick={() => handleUnapply(candidate.id)}
                >
                  Unapply
                </Button>
              </Box>
            ))
          ) : (
            <Text>No candidates have applied to this listing yet.</Text>
          )}
        </VStack>
      </ModalWrapper>

      <ModalWrapper
        isOpen={isNotAppliedOpen}
        onClose={onNotAppliedClose}
        title="Candidates who can apply"
        confirmButtonText="Close"
        confirmButtonColorScheme="blue"
        onConfirm={onNotAppliedClose}
      >
        <VStack spacing={4} align="stretch">
          {notAppliedCandidates.length > 0 ? (
            notAppliedCandidates.map((candidate) => (
              <Box
                key={candidate.id}
                p={4}
                shadow="sm"
                borderWidth="1px"
                borderRadius="md"
              >
                <Text fontWeight="bold">{candidate.name}</Text>
                <Text>{candidate.email}</Text>
                <Button
                  mt={2}
                  colorScheme="teal"
                  onClick={() => handleApply(candidate.id)}
                >
                  Apply
                </Button>
              </Box>
            ))
          ) : (
            <Text>All candidates have already applied to this listing.</Text>
          )}
        </VStack>
      </ModalWrapper>

      <ModalWrapper
        isOpen={isEditOpen}
        onClose={onEditClose}
        title="Edit Listing"
        confirmButtonText="Update"
        confirmButtonColorScheme="blue"
        onConfirm={handleUpdateListing}
        isLoading={loading}
      >
        <FormControl id="title" isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
        </FormControl>
        <FormControl id="description" mt={4} isRequired>
          <FormLabel>Description</FormLabel>
          <Input
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
        </FormControl>
      </ModalWrapper>

      <ModalWrapper
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        title="Delete Listing"
        confirmButtonText="Delete"
        confirmButtonColorScheme="red"
        onConfirm={handleDeleteListing}
        isLoading={loading}
      >
        <Text>
          Are you sure you want to delete this listing? This action cannot be
          undone.
        </Text>
      </ModalWrapper>
    </Box>
  );
};

export default ListingDisplay;
