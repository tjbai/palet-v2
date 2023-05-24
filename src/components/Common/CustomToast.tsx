import { Flex } from "@chakra-ui/react";

export default function CustomToast({
  description,
  bgColor,
  fontColor,
}: {
  description?: string;
  bgColor?: string;
  fontColor?: string;
}) {
  return (
    <Flex maxW="400px" bg={bgColor} color={fontColor}>
      {description}
    </Flex>
  );
}
