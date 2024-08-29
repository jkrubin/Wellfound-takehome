import { Center, Box, Text } from "@chakra-ui/react";
import React from "react";

const EmptyList: React.FC<{ topText: string; bottomText: string }> = ({
  topText,
  bottomText,
}) => {
  return (
    <Center py={10}>
      <Box textAlign="center" maxW="md">
        <Text fontSize="lg" color="gray.500">
          {topText}
        </Text>
        <Text fontSize="md" color="gray.500">
          {bottomText}
        </Text>
      </Box>
    </Center>
  );
};
export default EmptyList;
