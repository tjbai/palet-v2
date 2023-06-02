"use client";

import { Box, Link, Text } from "@chakra-ui/react";
import BelowNowPlayingWrapper from "../Player/BelowNowPlayingWrapper";
import { useStyles } from "../Providers/StyleProvider";

export default function BelowNowPlayingError({ error }: { error: string }) {
  const { gradient } = useStyles();

  return (
    <BelowNowPlayingWrapper height={100} padding={15} showBorder>
      <Box
        color={
          !gradient.exists || gradient.position === "top" ? "black" : "white"
        }
        fontWeight="bold"
      >
        <Text>Issue fetching playlist...</Text>
        <Text>Error: {error}</Text>
        <Text>
          Reload the page, if the issue persists then
          <Link href="mailto:omar@paletapp.com" ml={1} fontStyle="italic">
            Contact us.
          </Link>
        </Text>
      </Box>
    </BelowNowPlayingWrapper>
  );
}
