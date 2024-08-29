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
  useToast,
} from "@chakra-ui/react";
import { useCandidateContext } from "../../Api/Candidate"; // Adjust the path as necessary
import EmptyList from "../EmptyList";
import { useAuth } from "../../Api/Auth";
import { Navigate } from "react-router";
import CandidateDisplay from "./CandidateDisplay";
import { ModalWrapper } from "../Modal";

const CandidatesPage: React.FC = () => {
  const { candidates, fetchCandidates, createCandidate } =
    useCandidateContext();
  const { isAuth } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCandidates = async () => {
      setIsLoading(true);
      await fetchCandidates();
      setIsLoading(false);
    };

    if (isAuth === "TRUE") {
      loadCandidates();
    }
  }, [isAuth]);

  if (isAuth === "FALSE") {
    toast({
      title: "You are not authenticated to view this page",
      description: `redirecting to login`,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return <Navigate to="/login" />;
  }

  const handleCreateCandidate = async () => {
    setIsLoading(true);
    try {
      await createCandidate(name, email);
      onClose();
    } catch (error) {
      console.error("Error creating candidate:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Candidates
        </Heading>
        <Button colorScheme="teal" onClick={onOpen}>
          Create New Candidate
        </Button>
        {isLoading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" color="teal.500" />
            <Text mt={4}>Loading candidates...</Text>
          </Box>
        ) : (
          <Stack spacing={6}>
            {candidates.map((candidate) => (
              <CandidateDisplay candidate={candidate} key={candidate.id} />
            ))}
            {candidates.length === 0 && (
              <EmptyList
                topText="No Candidates found"
                bottomText="Wait for candidates to be created or create one"
              />
            )}
          </Stack>
        )}
      </VStack>

      <ModalWrapper
        isOpen={isOpen}
        onClose={onClose}
        title="Create a New Candidate"
        confirmButtonText="Create"
        confirmButtonColorScheme="teal"
        onConfirm={handleCreateCandidate}
        isLoading={isLoading}
      >
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <FormControl id="email" mt={4} isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
      </ModalWrapper>
    </Container>
  );
};

export default CandidatesPage;
