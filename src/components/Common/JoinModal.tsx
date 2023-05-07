"use client";

// import { supabase } from "@/lib/db/supabaseClient";
import {
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useModal } from "../Providers/ModalProvider";
import { v4 as uuidv4 } from "uuid";
import hashString from "@/lib/funcs/hashString";

export default function JoinModal() {
  const toast = useToast();
  const { joinModal, setJoinModal } = useModal();
  const [flag, setFlag] = useState("");
  const [email, setEmail] = useState("");
  const [referralLink, setReferralLink] = useState("");

  const copyClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied to clipboard",
    });
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const submitEmail = async (e: any) => {
    e.preventDefault();

    // const submission = email.toLowerCase();
    // if (!validateEmail(submission)) {
    //   setFlag("Email format invalid");
    //   return;
    // }

    // setFlag("");

    // const { data } = await supabase
    //   .from("emails")
    //   .select("*")
    //   .eq("email", submission);

    // // Email exists
    // if (data?.length) {
    //   setFlag("Email already exists");
    //   setReferralLink(`https://paletapp.com/${hashString(data[0].id)}`);
    // }
    // // Email doesn't exist
    // else {
    //   setEmail("");
    //   // User has previously registered
    //   if (localStorage.getItem("registered") === "1") {
    //     setFlag("Already registered with a different email");
    //   }
    //   // User hasn't previously registered
    //   else {
    //     const { error } = await supabase
    //       .from("emails")
    //       .insert({ id: uuidv4(), email: submission });
    //     if (error) console.error(error);
    //     const { data, error: postError } = await supabase
    //       .from("emails")
    //       .select("*")
    //       .eq("email", submission);
    //     if (postError) console.error(postError);
    //     else setReferralLink(`https://paletapp.com/${hashString(data[0].id)}`);
    //     localStorage.setItem("registered", "1");
    //   }
    // }
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
            <form onSubmit={submitEmail}>
              <Input
                placeholder="Your email"
                variant="flushed"
                mt={4}
                mb={2}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onSubmit={() => submitEmail(email)}
              />
            </form>
            <Text color="red">{flag}</Text>

            <Text mt={4} fontWeight="bold">
              Your custom referral link:{" "}
            </Text>
            <Text _hover={{ cursor: "pointer" }} onClick={copyClipboard}>
              {referralLink}
            </Text>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
