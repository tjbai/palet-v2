import { usePlayer } from "@/components/Providers/PlayerProvider";
import usePlaylistBrowser from "@/lib/hooks/usePlaylistBrowser";
import { PlaylistPreview } from "@/lib/types";
import { artistsToString, msToTime } from "@/lib/util";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import error from "next/error";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isError, useQuery, useQueryClient } from "react-query";
import { usePlaylistPreviews } from "../PlayerController";

export default function VerticalTrackDisplay() {
  const { playlistContext, currentTrack, playTime, browsePlaylistContext } =
    usePlayer();
  const [offset, setOffset] = useState(0);
  const { browse } = usePlaylistBrowser();

  useEffect(() => {
    if (!currentTrack) return;
    const elapsedPercentage = (playTime * 1000) / currentTrack.durationMs;
    const newOffset = elapsedPercentage * (window.innerWidth * 0.4 - 100);
    setOffset(newOffset);
  }, [playTime]);

  return (
    <Flex
      h="100%"
      flex={2}
      mr="10px"
      borderRadius="15px"
      bg="black"
      fontFamily="tech"
      maxW="40%"
      direction="column"
      overflow="hidden"
      pt="5px"
      pl="15px"
      overflowY="scroll"
      boxShadow="inset -5px -5px 20px rgba(255,255,255,0.4)"
    >
      <Text
        color="white"
        mb="10px"
        mt={currentTrack ? "10px" : "0px"}
        noOfLines={1}
        zIndex={10}
        bg="transparent"
      >
        {playlistContext
          ? playlistContext.index !== -1
            ? "Now Playing: " +
              currentTrack?.name! +
              " by " +
              artistsToString(currentTrack?.artists) +
              " (" +
              msToTime(playTime * 1000) +
              "/" +
              msToTime(currentTrack?.durationMs) +
              ") from: "
            : ""
          : ""}
      </Text>
      <Text
        fontSize="190px"
        lineHeight="155px"
        wordBreak="break-all"
        noOfLines={2}
        color="dark_purple"
        position="relative"
        left="-15px"
        _hover={{ cursor: "pointer" }}
        onClick={() =>
          browse(
            currentTrack
              ? playlistContext!.routeAlias
              : browsePlaylistContext!.routeAlias
          )
        }
      >
        {currentTrack
          ? playlistContext?.name.padEnd(10, " ").toUpperCase()
          : browsePlaylistContext?.name.padEnd(10, " ").toUpperCase()}
      </Text>

      <Flex direction="column">
        <Flex
          w="calc(100% - 15px)"
          border="0.5px solid white"
          mt="10px"
          h="0px"
        >
          <Box
            h="12px"
            w="12px"
            borderRadius="50%"
            bg="purple"
            position="relative"
            top="-6px"
            left="-5px"
            transform={`translateX(${offset}px)`}
            transition="1s linear transform"
          />
        </Flex>
        <Flex justify="space-between" color="white" mr="15px" mt="5px">
          <Text>{msToTime(playTime * 1000)}</Text>
          <Text>{msToTime(currentTrack?.durationMs)}</Text>
        </Flex>
        <PlaylistDashboard />
      </Flex>
    </Flex>
  );
}

function PlaylistDashboard() {
  const { browsePlaylistContext } = usePlayer();
  const { browse } = usePlaylistBrowser();
  const { isLoading, isError, error, playlistPreviews } = usePlaylistPreviews();
  const [displayMode, setDisplayMode] = useState("browse");

  if (isLoading) return <Text color="white">Loading...</Text>;
  if (isError)
    return (
      <Text color="white">
        Error: {(error as { message: "string" }).message}
      </Text>
    );

  return (
    <Flex direction="column" color="white" mt="15px">
      <Flex
        direction="row"
        w="calc(100% - 15px)"
        borderBottom="1px solid"
        borderColor="lightgrey"
        mb="5px"
      >
        <Text
          _hover={{ cursor: "pointer" }}
          fontWeight={displayMode === "browse" ? "bold" : "regular"}
          color={displayMode === "browse" ? "white" : "grey"}
          onClick={() => setDisplayMode("browse")}
        >
          Browse
        </Text>
        <Text
          _hover={{ cursor: "pointer" }}
          ml={2}
          fontWeight={displayMode === "waveform" ? "bold" : "regular"}
          color={displayMode === "waveform" ? "white" : "grey"}
          onClick={() => setDisplayMode("waveform")}
        >
          Waveform
        </Text>
      </Flex>

      {displayMode === "browse" ? (
        playlistPreviews!.map((p) => (
          <Flex
            key={p.id}
            color={browsePlaylistContext?.id === p.id ? "purple" : "white"}
            _hover={{ cursor: "pointer", color: "purple" }}
            onClick={() => browse(p.routeAlias)}
          >
            {p.name}
          </Flex>
        ))
      ) : (
        <Text>Coming soon...</Text>
      )}
    </Flex>
  );
}

/*
function PlaylistNameGrid({ name }: { name: string | undefined }) {
  const rows = 2;
  const cols = 5;

  if (!name) return null;

  const rcToIndex = (r: number, c: number) => {
    return r * cols + c;
  };

  return (
    <Flex pt="15px" m={0} direction="column" border="1px solid red" mr="-100px">
      {Array.from({ length: rows }).map((_, r) => (
        <Flex key={r} direction="row" border="1px solid green">
          {Array.from({ length: cols }).map((_, c) => {
            const i = rcToIndex(r, c);
            return (
              <Box
                key={i}
                fontSize="200px"
                lineHeight="140px"
                color={
                  i >= name.length || name.charAt(i) == " "
                    ? "#212121"
                    : "purple"
                }
              >
                {i >= name.length || name.charAt(i) == " "
                  ? "X"
                  : name.charAt(i).toUpperCase()}
              </Box>
            );
          })}
        </Flex>
      ))}
    </Flex>
  );
}
*/
