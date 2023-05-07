"use client";

import {
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useState, useTransition } from "react";
import { useModal } from "../Providers/ModalProvider";

export default function JoinModal() {
  const { joinModal, setJoinModal } = useModal();
  const [email, setEmail] = useState("");

  return (
    <Modal isOpen={joinModal} onClose={() => setJoinModal(false)}>
      <ModalOverlay
        bg="none"
        backdropFilter="auto"
        backdropInvert="80%"
        backdropBlur="2px"
      />
      <ModalContent
        borderRadius="0px"
        bg="none"
        shadow="none"
        alignContent={"center"}
        justifyContent={"center"}
        w={{ base: "95vw", lg: "60vw" }}
      >
        <ModalBody bg="none" p={1} w="100%">
          <Flex
            bg="black"
            color="white"
            px={5}
            py={2}
            pb={4}
            fontFamily="bodyalt"
            direction="column"
          >
            <Text fontSize="25px" fontWeight="bold">
              Palet Waitlist
            </Text>
            <Text>
              Join and refer your friends to enter a raffle for 2 free tickets
              to Boiler Room NYC on July 15th!
            </Text>
            <Input
              placeholder="Your email"
              variant="flushed"
              mt={4}
              mb={2}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
