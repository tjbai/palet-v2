import { usePlayer } from "@/components/Providers/PlayerProvider";
import { artistsToString, msToTime } from "@/lib/util";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";

/*
Some real fuck shit going on here to get this nicely aligned column
*/

export default function TrackListController() {
  const { browsePlaylistContext, currentTrack } = usePlayer();
  const { selectSong } = usePlayer();

  useEffect(() => {
    if (!currentTrack) return;

    const timeout = setTimeout(() => {
      const element = document.getElementById(`song-${currentTrack.id}`);
      element?.scrollIntoView({ behavior: "smooth" });
    }, 250);

    return () => clearTimeout(timeout);
  }, [currentTrack]);

  console.log(browsePlaylistContext?.name);

  return (
    <Flex
      w="100%"
      maxH="50%"
      flex={1}
      bg="black"
      p="5px"
      overflowY="auto"
      overflowX="hidden"
      color="white"
      borderRadius="10px"
      direction="column"
      css={{
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
      boxShadow="inset -5px -5px 20px rgba(255,255,255,0.4)"
      fontFamily="bodyalt"
    >
      {browsePlaylistContext ? (
        browsePlaylistContext.songs.map((s, i) => (
          <Flex
            direction="row"
            w="100%"
            key={s.id}
            _hover={{ cursor: "pointer", color: "orange" }}
            onClick={() => selectSong(s.name)}
            color={currentTrack?.id === s.id ? "orange" : "white"}
            mt="5px"
            borderColor={currentTrack?.id === s.id ? "orange" : "white"}
          >
            <Box position="relative" top="-200px" id={`song-${s.id}`} />
            <Flex
              borderRight="1px solid"
              w="40px"
              align="center"
              justify="center"
            >
              {i + 1 < 10 ? "0" + (i + 1) : i + 1}
            </Flex>
            <Flex
              align="center"
              justify="center"
              w="60px"
              borderRight="1px solid"
            >
              {msToTime(s.durationMs)}
            </Flex>

            <Flex
              w="200px"
              ml="10px"
              borderRight="1px solid"
              whiteSpace="nowrap"
              overflowX="auto"
              css={{
                "::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Text>{artistsToString(s.artists)}</Text>
            </Flex>
            <Flex ml="10px" w="calc(100% - 320px)" justify="space-between">
              <Flex
                whiteSpace="nowrap"
                w="fit-content"
                overflowX="auto"
                css={{
                  "::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                {s.name}
              </Flex>
              <Flex
                flex={1}
                borderBottom="1px solid grey"
                height="13px"
                ml="5px"
              />
              <Box
                color={s.kandiCount > 0 ? "orange" : "grey"}
                ml="10px"
                mr="10px"
              >
                {s.kandiCount}
              </Box>
            </Flex>
          </Flex>
        ))
      ) : (
        <Text ml="10px" mt="10px">
          No mix selected
        </Text>
      )}
    </Flex>
  );
}

/*
function TrackList({ displayMode }: { displayMode: "current" | "browse" }) {
  const { playlistContext, currentTrack } = usePlayer();
  const { selectSong } = usePlayer();

  useEffect(() => {
    if (!currentTrack) return;

    const timeout = setTimeout(() => {
      const element = document.getElementById(`song-${currentTrack.id}`);
      element?.scrollIntoView({ behavior: "smooth" });
    }, 250);

    return () => clearTimeout(timeout);
  }, [currentTrack]);

  if (displayMode === "current") {
    return (
      <>
        {playlistContext ? (
          playlistContext.songs.map((s, i) => (
            <Flex
              direction="row"
              w="100%"
              key={s.id}
              _hover={{ cursor: "pointer", color: "orange" }}
              onClick={() => selectSong(s.name)}
              color={currentTrack?.id === s.id ? "orange" : "white"}
            >
              <Box position="relative" top="-200px" id={`song-${s.id}`} />
              <Flex
                borderRight="1px solid white"
                w="40px"
                align="center"
                justify="center"
              >
                {i < 10 ? "0" + i : i}
              </Flex>
              <Flex
                align="center"
                justify="center"
                w="60px"
                borderRight="1px solid white"
              >
                {msToTime(s.durationMs)}
              </Flex>

              <Flex
                w="200px"
                ml="10px"
                borderRight="1px solid white"
                whiteSpace="nowrap"
                overflowX="auto"
                css={{
                  "::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                <Text>{artistsToString(s.artists)}</Text>
              </Flex>
              <Flex ml="10px" w="calc(100% - 320px)" justify="space-between">
                <Flex
                  whiteSpace="nowrap"
                  w="fit-content"
                  overflowX="auto"
                  css={{
                    "::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  {s.name}
                </Flex>
                <Flex
                  flex={1}
                  borderBottom="1px solid grey"
                  height="13px"
                  ml="5px"
                />
                <Box color="orange" ml="10px" mr="10px">
                  {s.kandiCount}
                </Box>
              </Flex>
            </Flex>
          ))
        ) : (
          <Text ml="10px">No mix selected...</Text>
        )}
      </>
    );
  } else {
    return <Text>HEYO</Text>;
  }
}
*/
