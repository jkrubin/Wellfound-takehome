import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Spacer,
  Link as ChakraLink,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Api/Auth";

export const Menu: React.FC = () => {
  const { isAuth, logout } = useAuth();
  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.900")}
      color={useColorModeValue("black", "white")}
      boxShadow="md"
      paddingY="2"
    >
      <Container maxW="container.lg">
        <Flex as="nav" align="center" justify="space-between">
          <Heading as="h1" size="lg" letterSpacing={"tighter"}>
            Jobs'R'Us
          </Heading>
          <Spacer />
          <HStack spacing={4} as="nav" fontWeight="bold">
            <Link to="/">Home</Link>
            <Link to="/listings">Listings</Link>
            <Link to="/candidates">Candidates</Link>
            {isAuth === "TRUE" ? (
              <ChakraLink
                as="button"
                onClick={logout}
                color="teal.500"
                fontWeight="bold"
                _hover={{ textDecoration: "none", color: "teal.700" }}
              >
                Log Out
              </ChakraLink>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};
