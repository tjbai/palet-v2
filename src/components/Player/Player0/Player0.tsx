"use client";

import { useStyles } from "@/components/Providers/StyleProvider";
import styleConstants from "@/lib/chakra/styleConstants";
import { PlaylistContext } from "@/lib/types";
import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import HorizontalTrackList from "./HorizontalTrackList";
import InteractiveControls from "./InteractiveControls";
import VerticalDisplay from "./VerticalTrackDisplay";
import VerticalTrackDisplay from "./VerticalTrackDisplay";

export const dynamic = "force-dynamic"; // idk

export default function Player0({
  playlistContext,
}: {
  playlistContext: PlaylistContext;
}) {
  const { setBackground } = useStyles();

  useEffect(() => setBackground("player0"), []);

  return (
    <Flex
      position="relative"
      top={styleConstants.headerHeight}
      direction="row"
      flex={1}
      h={`calc(100vh - ${styleConstants.headerHeight} - 30px)`}
    >
      <VerticalTrackDisplay />
      <Flex flex={3} direction="column" maxW="60%">
        <HorizontalTrackList />
        <InteractiveControls />
      </Flex>
    </Flex>
  );
}
