"use client";

import { PlaylistPreview } from "@/lib/types";
import { msToTime } from "@/lib/util";
import {
  Box,
  Flex,
  HStack,
  Icon,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaMusic } from "react-icons/fa";
import BelowNowPlayingWrapper from "../Player/BelowNowPlayingWrapper";
import NowPlaying from "../Player/NowPlaying";
import { useStyles } from "../Providers/StyleProvider";

export default function Discovery({
  playlistPreviews,
}: {
  playlistPreviews: PlaylistPreview[];
}) {
  const { setBackground } = useStyles();

  useEffect(() => setBackground("discovery"), []);

  return (
    <Flex>
      <NowPlaying />
      <BelowNowPlayingWrapper height={100} padding={15}>
        <Flex w="calc(100vw - 50px)" direction="column">
          <TopOnPalet playlistPreviews={playlistPreviews} />
          <Recommended playlistPreviews={playlistPreviews} />
          <ExploreAll playlistPreviews={playlistPreviews} />
        </Flex>
      </BelowNowPlayingWrapper>
    </Flex>
  );
}

function TopOnPalet({
  playlistPreviews,
}: {
  playlistPreviews: PlaylistPreview[];
}) {
  playlistPreviews.sort((a, b) => b.kandiCount - a.kandiCount);
  return (
    <Flex direction="column">
      <Text fontSize={{ base: "17px", md: "22px" }} mb="5px" fontWeight="bold">
        Top on Palet
      </Text>
      <ResponsivePlaylistRow
        playlistPreviews={playlistPreviews}
        scrollOffset={50}
      />
    </Flex>
  );
}

function ExploreAll({
  playlistPreviews,
}: {
  playlistPreviews: PlaylistPreview[];
}) {
  return (
    <Flex direction="column" mt="15px">
      <Text fontSize={{ base: "17px", md: "22px" }} mb="5px" fontWeight="bold">
        Explore All
      </Text>
      <ResponsivePlaylistRow
        playlistPreviews={playlistPreviews}
        scrollOffset={10}
      />
    </Flex>
  );
}

function Recommended({
  playlistPreviews,
}: {
  playlistPreviews: PlaylistPreview[];
}) {
  return (
    <Flex direction="column" mt="15px">
      <Text fontSize={{ base: "17px", md: "22px" }} mb="5px" fontWeight="bold">
        Recommended For You
      </Text>
      <ResponsivePlaylistRow
        playlistPreviews={playlistPreviews}
        scrollOffset={10}
      />
    </Flex>
  );
}

// TODO: set blurDataURL
function ResponsivePlaylistRow({
  playlistPreviews,
  scrollOffset,
}: {
  playlistPreviews: PlaylistPreview[];
  scrollOffset: number;
}) {
  const scrollableDivRef = useRef<HTMLDivElement>(null);

  const spacing = useBreakpointValue({ base: 3, md: 4, lg: 8 });

  return (
    <HStack
      overflowX="auto"
      flexWrap="nowrap"
      spacing={spacing}
      overflowY="hidden"
      ref={scrollableDivRef}
      transition="0.5s"
      css={{
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {playlistPreviews.map((playlist) => (
        <Preview playlist={playlist} key={playlist.id} />
      ))}
    </HStack>
  );
}

function Preview({ playlist }: { playlist: PlaylistPreview }) {
  const router = useRouter();
  const boxSize = useBreakpointValue(
    { base: 150, sm: 200, md: 250, lg: 300 },
    { ssr: false }
  );
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      minW={`${boxSize}px`}
      minH={`${boxSize}px`}
      transition="transform 0.25s"
      _hover={{ cursor: "pointer" }}
      onClick={() => router.push(`/player/?crate=${playlist.routeAlias}`)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      position="relative"
    >
      <Flex
        w="100%"
        h="100%"
        bg="black"
        position="absolute"
        opacity={isHovered ? 0.5 : 0}
        transition="0.2s"
        color="white"
        padding="10px"
      >
        <Text fontSize={{ base: "17px", md: "22px" }}>
          {playlist.name +
            " / " +
            msToTime(playlist.totalDuration) +
            " / " +
            playlist.kandiCount +
            " K"}
        </Text>
      </Flex>

      {playlist.imageUrl ? (
        <Image
          src={playlist.imageUrl}
          alt={playlist.name}
          width={boxSize}
          height={boxSize}
        />
      ) : (
        <Flex
          width={boxSize}
          height={boxSize}
          bg="lightgrey"
          align="center"
          justify="center"
        >
          <Icon
            as={FaMusic}
            fontSize={`${boxSize! / 10}px`}
            color="lightgrey"
          />
        </Flex>
      )}
    </Box>
  );
}
