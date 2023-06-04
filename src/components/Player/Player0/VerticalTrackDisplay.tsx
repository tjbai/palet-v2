import { usePlayer } from "@/components/Providers/PlayerProvider";
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";

export default function VerticalTrackDisplay() {
  const { playlistContext, currentTrack } = usePlayer();

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
      pt="15px"
    >
      {/* <Flex w="100%" color="white" direction="column">
        <Text>LISTENING TO: {playlistContext?.name}</Text>
        <Text>NOW PLAYING: </Text>
      </Flex> */}
      {/* <Text fontSize="100px" lineHeight="90px" fontFamily="tech"></Text> */}
      {/* <PlaylistNameGrid name={playlistContext?.name} /> */}
      <Text
        fontSize="200px"
        lineHeight="150px"
        wordBreak="break-all"
        noOfLines={2}
        color="dark_purple"
      >
        {playlistContext?.name.padEnd(10, "X").replace(" ", "X").toUpperCase()}
      </Text>
    </Flex>
  );
}

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
