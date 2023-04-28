"use client";

import { Flex, Icon, Text, Link as ChakraLink } from "@chakra-ui/react";
import { Link as NextLink } from "@chakra-ui/next-js";
import { FaTiktok as TikTok } from "react-icons/fa";
import { GrInstagram as Instagram, GrSpotify as Spotify } from "react-icons/gr";
import trackClickthrough from "@/lib/funcs/trackClickthrough";
import { useStyles } from "./StyleProvider";
import { useEffect, useState } from "react";

export default function Header() {
  const { gradientPosition } = useStyles();
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
        fontSize="30px"
        fontWeight="medium"
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
            h="35px"
            w="35px"
            p={0}
            border="2px solid white"
            borderRadius="50%"
            ml={3}
          >
            <Flex bg="white" w="15px" h="15px" borderRadius="50%" />
          </Flex>
        </Flex>

        <Flex align="center" fontSize="25px" fontWeight="medium">
          <NextLink
            href="/join"
            mr={5}
            borderColor="white"
            borderRadius="20px"
            fontSize="20px"
            _hover={{ textDecoration: "none" }}
          >
            Join
          </NextLink>
          <Text
            onClick={() => trackClickthrough("to_events")}
            // border="1px solid"
            borderColor="white"
            borderRadius="20px"
            fontSize="20px"
          >
            <ChakraLink
              href="https://www.notion.so/NYC-Electronic-FRI-4-28-SAT-4-29-2-20136bf151244910ac90c0b60fb8726c"
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
            ml={5}
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
            ml={4}
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
