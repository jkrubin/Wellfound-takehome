import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Container,
  Spinner,
  Stack,
  useColorModeValue,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Center,
  Icon,
} from "@chakra-ui/react";

import { useListingContext } from "../../Api/Listing";
import { useAuth } from "../../Api/Auth";
import ListingDisplay from "./ListingDisplay";
import { useCandidateContext } from "../../Api/Candidate";
import EmptyList from "../EmptyList";

const ListingsPage: React.FC = () => {
  const { listings, fetchListings, createListing } = useListingContext();
  const { fetchCandidates } = useCandidateContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { isAuth } = useAuth();
  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      await fetchListings();
      setLoading(false);
    };
    loadListings();
  }, []);

  useEffect(() => {
    if (isAuth === "TRUE") {
      fetchCandidates();
    }
  }, [isAuth]);
  const handleCreateListing = async () => {
    setLoading(true);
    try {
      await createListing(title, description);
      onClose();
    } catch (error) {
      //do nothing
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Available Listings
        </Heading>
        {isAuth === "TRUE" && (
          <Button colorScheme="teal" onClick={onOpen}>
            Create New Listing
          </Button>
        )}
        {isLoading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" color="teal.500" />
            <Text mt={4}>Loading listings...</Text>
          </Box>
        ) : (
          <Stack spacing={6}>
            {listings.map((listing) => (
              <ListingDisplay listing={listing} key={listing.id} />
            ))}
            {listings.length === 0 && (
              <EmptyList
                topText="No listings available"
                bottomText="Please check back later or create a new listing."
              />
            )}
          </Stack>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a New Listing</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="title" isRequired>
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl id="description" mt={4} isRequired>
              <FormLabel>Description</FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={handleCreateListing}
              isLoading={isLoading}
            >
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ListingsPage;
