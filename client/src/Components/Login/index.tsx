import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useToast,
  VStack,
  Container,
} from "@chakra-ui/react";
import { useAuth } from "../../Api/Auth";

export const Login: React.FC = () => {
  const { login, register } = useAuth();
  const toast = useToast();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isLoginMode) {
        await login({ email, password });
        toast({
          title: "Logged in successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await register({ email, password });
        toast({
          title: "Account created successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      //Do nothing
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="md" centerContent>
      <VStack spacing={8} width="full">
        <Heading as="h1" size="xl" textAlign="center">
          {isLoginMode ? "Login" : "Register"}
        </Heading>
        <Box rounded="lg" boxShadow="lg" p={8} width="full">
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button
              colorScheme="teal"
              size="lg"
              onClick={handleSubmit}
              isLoading={loading}
            >
              {isLoginMode ? "Login" : "Register"}
            </Button>
          </Stack>
          <Stack pt={6}>
            <Text align="center">
              {isLoginMode
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <Button
                variant="link"
                colorScheme="teal"
                onClick={() => setIsLoginMode(!isLoginMode)}
              >
                {isLoginMode ? "Sign up" : "Login"}
              </Button>
            </Text>
          </Stack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Login;
