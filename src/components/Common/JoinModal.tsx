"use client";

import { supabase } from "@/lib/db/supabaseClient";
import {
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useModal } from "../Providers/ModalProvider";
import { v4 as uuidv4 } from "uuid";

export default function JoinModal() {
  const { joinModal, setJoinModal } = useModal();
  const [flag, setFlag] = useState("");
  const [email, setEmail] = useState("");

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const submitEmail = async (e: any) => {
    e.preventDefault();
    const submission = email.toLowerCase();
    if (!validateEmail(submission)) {
      setFlag("Email format invalid");
      return;
    }
    setFlag("");

    const { data, error } = await supabase
      .from("emails")
      .select("*")
      .eq("email", submission);

    if (!data?.length) {
      const { data, error } = await supabase
        .from("emails")
        .insert({ id: uuidv4(), email: submission });
      setFlag("");
      setEmail("");

      if (error) {
        console.error(error);
      }
    } else {
      console.log(data);
    }
  };

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
        autoFocus
        alignContent={"center"}
        justifyContent={"center"}
        w="60vw"
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
            <Text fontSize="25px">Palet Waitlist</Text>
            <Text>
              Join and refer your friends to enter a raffle for 2 free tickets
              to Boiler Room NYC, July 15th.
            </Text>
            <Text color="red">{flag}</Text>
            <form onSubmit={submitEmail}>
              <Input
                placeholder="email"
                variant="flushed"
                my={4}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onSubmit={() => submitEmail(email)}
              />
            </form>

            <Text>Your custom referral link: </Text>
          </Flex>
          {/* <Flex>
            <Image
              src={"/images/landing-bg-v2.jpg"}
              alt="landing-bg-v2"
              objectFit="cover"
              w="100%"
              h="200px"
              filter="blur(10px)"
              position="absolute"
              zIndex="-1"
            />
            <Flex flex={1} align="center" justify="center" color="white">
              <Text fontSize="30px" fontWeight="bold">
                Join the Palet Waitlist
              </Text>
            </Flex>
          </Flex> */}

          {/* <Flex
            flex={1}
            align="center"
            justify="center"
            direction="column"
            textAlign="center"
            px={10}
            py={5}
          >
            <Text fontSize="30px" fontWeight="bold">
              Join the Palet Waitlist
            </Text>
            <Text>
              Join and refer your friends to win 2 free tickets to Boiler Room
              NYC on July 15th!
            </Text>
            <Input
              placeholder="Enter your email"
              variant="flushed"
              textAlign="center"
              mt={5}
            />
          </Flex> */}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
