import usePlayer from "@/lib/hooks/usePlayer";
import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

export default function NowPlaying() {
  const bucketItems = ["porco.mp3"];
  const [bucketIndex, setBucketIndex] = useState(0);
  const { playing, toggle } = usePlayer();
  const [player, setPlayer] = useState<any>();

  useEffect(() => {
    setPlayer(
      <ReactPlayer
        url={`${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${bucketItems[bucketIndex]}`}
        playing={playing}
        controls={true}
        w="0px"
        h="0px"
      />
    );
  }, [bucketIndex]);

  return (
    <Flex align="center" ml={5}>
      <Flex display="none">{player}</Flex>

      <Flex w="100%" onClick={() => console.log("HELLO")}>
        <Text fontSize="20px" _hover={{ cursor: "pointer" }}>
          {playing ? "Now Playing: " : "Start Radio"}
        </Text>
      </Flex>
    </Flex>
  );
}
