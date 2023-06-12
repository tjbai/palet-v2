import { usePlayer } from "@/components/Providers/PlayerProvider";
import { msToTime } from "@/lib/util";
import { Flex, Box, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function PlaybackIndicator({ color }: { color?: string }) {
  const [offset, setOffset] = useState(0);
  const { currentTrack, playTime } = usePlayer();

  useEffect(() => {
    if (!currentTrack) return;
    const elapsedPercentage = (playTime * 1000) / currentTrack.durationMs;
    const newOffset = elapsedPercentage * (window.innerWidth * 0.4 - 100);
    setOffset(newOffset);
  }, [playTime]);

  return (
    <>
      <Flex w="calc(100% - 15px)" border="0.5px solid white" mt="10px" h="0px">
        <Box
          h="12px"
          w="12px"
          borderRadius="50%"
          bg={color ?? "purple"}
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
    </>
  );
}
