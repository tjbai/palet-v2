import { VStack, Flex, Button, Highlight, Text, Link } from "@chakra-ui/react";
import { useState } from "react";
import SectionWrapper from "../Common/SectionWrapper";

export default function About() {
  return (
    <Flex direction="column" maxW={{ sm: "100%", md: "60%" }}>
      <ArtistsListenersSection />
      <KandiSection />
    </Flex>
  );
}

const scrollToSection = (section: number) => {
  const sectionElement = document.getElementById(`section-${section}`);
  sectionElement?.scrollIntoView({
    behavior: "smooth",
  });
};

function ArtistsListenersSection() {
  const [selection, setSelection] = useState<"artists" | "listeners">(
    "listeners"
  );

  function ListenerSpew() {
    return (
      <VStack align="flex-start" fontSize={{ sm: "20px", md: "2vw" }} mt={3}>
        <Text>
          Palet is a streaming platform that builds on the ways you stream,
          discover, and engage with music.
        </Text>
        <Text>
          For the superfans, club rats, and audiophiles of the world, connect
          with fellow fans and artists like never before.
        </Text>
        <Text>
          From better live event discovery to providing more opportunities to
          connect with artists, we want to do it all.
        </Text>

        <Text>
          Confused? That&apos;s okay.
          <Link href="mailto:omar@paletapp.com" ml={2} fontWeight="bold">
            Contact us.
          </Link>
        </Text>
      </VStack>
    );
  }

  function ArtistSpew() {
    return (
      <VStack align="flex-start" fontSize={{ sm: "20px", md: "2vw" }} mt={3}>
        <Text>Your life is too hard. We want to make it easy.</Text>
        <Text>
          Palet puts all the tools you might need to build a career and brand in
          one place.
        </Text>
        <Text>
          Rather than hopping between platforms and subscriptions, we merge
          functionality like hosting music, monetization, and managing live
          events.
        </Text>
        <Text>
          Confused? That&apos;s okay.
          <Link href="google.com" ml={2} fontWeight="bold">
            Contact us.
          </Link>
        </Text>
      </VStack>
    );
  }

  return (
    <SectionWrapper>
      <Flex position="relative" top="-60px" id="section-2" />
      <Flex direction="column" id="section-2" pt={{ sm: "20px", md: "1.5vw" }}>
        <Flex
          // borderBottom="1px solid black"
          // pb={5}
          w="fit-content"
          fontSize={{ sm: "35px", md: "5vw" }}
          lineHeight={{ sm: "35px", md: "4vw" }}
        >
          <Text
            _hover={{
              cursor: "pointer",
            }}
            onClick={() => {
              setSelection("listeners");
            }}
            fontWeight={selection === "listeners" ? "bold" : "fine"}
          >
            Listeners
          </Text>
          <Text
            ml="1vw"
            _hover={{
              cursor: "pointer",
            }}
            onClick={() => {
              setSelection("artists");
            }}
            fontWeight={selection === "artists" ? "bold" : "fine"}
          >
            Artists
          </Text>
        </Flex>

        <Text maxW={{ sm: "100%", md: "100vw" }} mt="1vw" fontSize="25px">
          {selection === "listeners" ? <ListenerSpew /> : <ArtistSpew />}
        </Text>
        <Button
          variant="base"
          w="400px"
          fontWeight="bold"
          fontSize="17px"
          mt="4vw"
          onClick={() => scrollToSection(3)}
        >
          What else?
        </Button>
      </Flex>
    </SectionWrapper>
  );
}

function KandiSection() {
  function KandiSpew() {
    return (
      <VStack align="flex-start" fontSize={{ sm: "20px", md: "2vw" }} mt={3}>
        <Text>Meritocratic monetization and discovery, at last.</Text>
        <Text>
          Users gift. Artists receive. It&apos;s that simple (really).
        </Text>
        <Text fontWeight="bold">No more label in the middle.</Text>
        <Text>Show your support and unlock exclusive benefits...</Text>
        <Text>
          Still confused? That&apos;s okay.
          <Link href="mailto:omar@paletapp.com" ml={2} fontWeight="bold">
            Contact us.
          </Link>
        </Text>
      </VStack>
    );
  }

  return (
    <SectionWrapper>
      <Flex direction="column" id="section-3">
        <Text
          fontSize={{ sm: "40px", md: "5vw" }}
          lineHeight={{ sm: "40px", md: "4vw" }}
          fontWeight="bold"
        >
          <Highlight
            query="(The Glue)"
            styles={{
              fontSize: { sm: "25px", md: "4vw" },
              lineHeight: "40px",
              fontStyle: "italic",
              fontWeight: "medium",
            }}
          >
            Kandi (The Glue)
          </Highlight>
        </Text>
        <KandiSpew />
      </Flex>
    </SectionWrapper>
  );
}
