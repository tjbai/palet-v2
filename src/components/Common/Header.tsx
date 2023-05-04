"use client";

import { Flex, Icon, Text, Link as ChakraLink } from "@chakra-ui/react";
import { Link as NextLink } from "@chakra-ui/next-js";
import { FaTiktok as TikTok } from "react-icons/fa";
import { GrInstagram as Instagram, GrSpotify as Spotify } from "react-icons/gr";
import trackClickthrough from "@/lib/funcs/trackClickthrough";
import { useStyles } from "../Providers/StyleProvider";
import { useEffect, useState } from "react";
import { useModal } from "../Providers/ModalProvider";

export default function Header() {
  const { gradientPosition } = useStyles();
  const { setJoinModal } = useModal();
  const [gb, setGb] = useState(gradientPosition === "bottom");

  useEffect(() => {
    setGb(gradientPosition === "bottom");
  }, [gradientPosition]);

  return (
    <Flex
      w="calc(100vw - 50px)"
      h="70px"
      position="fixed"
      zIndex={2}
      color={gb ? "white" : "black"}
    >
      <Flex
        w="100%"
        justify="space-between"
        align="center"
        fontSize={{ base: "20px", md: "30px" }}
      >
        <Flex direction="row" align="center">
          <Text>
            <NextLink href="/" _hover={{ textDecoration: "none" }}>
              Palet
            </NextLink>
          </Text>
          <Flex
            align="center"
            justify="center"
            h={{ base: "25px", md: "35px" }}
            w={{ base: "25px", md: "35px" }}
            p={0}
            border="2px solid"
            borderRadius="50%"
            ml={3}
          >
            <Flex
              w={{ base: "10px", md: "15px" }}
              h={{ base: "10px", md: "15px" }}
              borderRadius="50%"
              bg={gradientPosition === "top" ? "black" : "white"}
            />
          </Flex>
        </Flex>

        <Flex
          align="center"
          fontSize={{ base: "17px", sm: "25px" }}
          fontWeight="medium"
        >
          <Text
            fontSize={{ base: "15px", sm: "20px" }}
            mr={5}
            _hover={{ cursor: "pointer" }}
            onClick={() => setJoinModal(true)}
          >
            Join
          </Text>
          <Text
            onClick={() => trackClickthrough("to_events")}
            // border="1px solid"
            borderColor="white"
            borderRadius="20px"
            fontSize={{ base: "15px", sm: "20px" }}
          >
            <ChakraLink
              href="https://celestial-lighter-b8e.notion.site/NYC-Electronic-THU-5-4-FRI-5-5-SAT-5-6-a45ca136b71f4771b842c4bee11fd1f0"
              isExternal
              _hover={{ textDecoration: "none" }}
            >
              Events
            </ChakraLink>
          </Text>
          <Icon
            ml={5}
            as={Instagram}
            _hover={{ cursor: "pointer" }}
            onClick={() => {
              trackClickthrough("to_ig");
              window.open("https://www.instagram.com/palet.edm/", "_blank");
            }}
          />
          <Icon
            ml={{ base: 3, md: 5 }}
            as={Spotify}
            _hover={{ cursor: "pointer" }}
            onClick={() => {
              trackClickthrough("to_spotify");
              window.open(
                "https://open.spotify.com/user/31sfjqvsrwyahshz4qe7bnlmjj5e?si=f38e00223e7a4d7b",
                "_blank"
              );
            }}
          />
          <Icon
            ml={{ base: 2.5, md: 4 }}
            as={TikTok}
            _hover={{ cursor: "pointer" }}
            onClick={() => {
              trackClickthrough("to_tiktok");
              window.open(
                "https://www.tiktok.com/@palet.edm?_t=8brGfCYHX1H&_r=1",
                "_blank"
              );
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
