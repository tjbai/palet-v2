"use client";

import styleConstants from "@/lib/chakra/styleConstants";
import { Link as NextLink } from "@chakra-ui/next-js";
import { Link as ChakraLink, Flex, Icon, Text } from "@chakra-ui/react";
import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import router from "next/router";
import { useEffect, useState } from "react";
import { FaTiktok as TikTok } from "react-icons/fa";
import { GrInstagram as Instagram, GrSpotify as Spotify } from "react-icons/gr";
import { useStyles } from "../Providers/StyleProvider";

export default function Header() {
  const { gradient } = useStyles();
  const [gb, setGb] = useState(gradient.position === "bottom");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => setGb(gradient.position === "bottom"), [gradient]);

  return (
    <Flex
      w="calc(100vw - 50px)"
      h={styleConstants.headerHeight}
      position="fixed"
      zIndex={5}
      color={!gb || !gradient.exists ? "black" : "white"}
      bg={gradient.exists ? "transparent" : "bg"}
      transition="color 2s ease-in-out"
    >
      <Flex
        w="100%"
        justify="space-between"
        align="center"
        fontSize={{ base: "20px", md: "30px" }}
      >
        <PaletLogo />
        <Flex align="center" fontSize={{ base: "17px", md: "22px" }}>
          {pathname === "/" || pathname === "about" ? (
            <Promotional />
          ) : (
            <UserButton />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

function PaletLogo() {
  const { gradient } = useStyles();
  return (
    <Flex direction="row" align="center">
      <Text>
        <NextLink href="/" _hover={{ textDecoration: "none" }}>
          Palet
        </NextLink>
      </Text>
      <Flex
        align="center"
        justify="center"
        h={{ base: "22px", md: "30px" }}
        w={{ base: "22px", md: "30px" }}
        p={0}
        border="2px solid"
        borderRadius="50%"
        ml={3}
        _hover={{ cursor: "pointer" }}
        onClick={() => router.push("/player")}
      >
        <Flex
          w={{ base: "9px", md: "12px" }}
          h={{ base: "9px", md: "12px" }}
          borderRadius="50%"
          transition="2s ease-in-out"
          bg={
            gradient.position === "top" || !gradient.exists ? "black" : "white"
          }
        />
      </Flex>
    </Flex>
  );
}

function Promotional() {
  const router = useRouter();
  return (
    <>
      <Text
        fontSize={{ base: "12px", md: "15px" }}
        mr={5}
        _hover={{ cursor: "pointer" }}
        onClick={() => router.push("/player")}
        px={2}
        border="1px solid"
        borderRadius="20px"
      >
        Join
      </Text>
      <Text
        // onClick={() => trackClickthrough("to_events")}
        borderColor="white"
        fontSize={{ base: "12px", md: "15px" }}
        border="1px solid"
        px={2}
        borderRadius="20px"
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
          window.open("https://www.instagram.com/palet.edm/", "_blank");
        }}
      />
      <Icon
        ml={{ base: 3, md: 5 }}
        as={Spotify}
        _hover={{ cursor: "pointer" }}
        onClick={() => {
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
          window.open(
            "https://www.tiktok.com/@palet.edm?_t=8brGfCYHX1H&_r=1",
            "_blank"
          );
        }}
      />
    </>
  );
}
