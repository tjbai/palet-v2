import { Flex } from "@chakra-ui/react";

export default function CustomToast({ message }: { message: string }) {
  return (
    <Flex bg="darkbg" color="white" align="center" justify="center">
      {message}
    </Flex>
  );
}
