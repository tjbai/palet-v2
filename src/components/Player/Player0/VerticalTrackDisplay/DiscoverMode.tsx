import { Box, Flex, Text } from "@chakra-ui/react";
import PlaybackIndicator from "./PlaybackIndicator";
import { usePlayer } from "@/components/Providers/PlayerProvider";
import { PlaylistPreview } from "@/lib/types";
import { msToTime } from "@/lib/util";
import Image from "next/image";
import { useModal } from "@/components/Providers/ModalProvider";
import { usePlayerController } from "../../PlayerController";

export default function DiscoverMode() {
  const { playlistPreviews, previewsLoading, previewsError } =
    usePlayerController();

  return (
    <>
      <Flex direction="column" flex={1} position="absolute">
        <Text
          fontSize="120px"
          lineHeight="100px"
          wordBreak="break-all"
          position="relative"
          left="-15px"
          _hover={{ cursor: "pointer" }}
          ml="5px"
          mt="10px"
          color="dark_orange"
        >
          DISCOVER
        </Text>
        <PlaybackIndicator color="dark_orange" />
      </Flex>

      <Flex
        w="100%"
        flex={1}
        mt="10px"
        direction="column"
        position="relative"
        maxH="calc(100% - 150px)"
        top="150px"
        overflowY="scroll"
      >
        {previewsLoading || previewsError ? (
          <Text>Loading...</Text>
        ) : (
          playlistPreviews?.map((preview) => (
            <ScrollPiece key={preview.id} preview={preview} />
          ))
        )}
      </Flex>
    </>
  );
}

function ScrollPiece({ preview }: { preview: PlaylistPreview }) {
  const { browse } = usePlayer();
  const { setDiscoverModal } = useModal();

  const handleSelect = () => {
    browse(preview.routeAlias);
    setDiscoverModal(false);
  };

  return (
    <Flex
      flex={1}
      w="100%"
      h="120px"
      maxH="120px"
      direction="row"
      p="10px"
      color="white"
      _hover={{ cursor: "pointer", transform: "scale(1.02)" }}
      transition="0.3s"
      onClick={handleSelect}
      bg="black"
      boxShadow="inset -10px 0px 8px -5px rgba(255,255,255,0.4)"
    >
      {preview.imageUrl ? (
        <Image
          src={preview.imageUrl ?? ""}
          alt="Playlist Cover"
          width={100}
          height={100}
          quality={90}
        />
      ) : (
        <Box w="200px" h="200px" />
      )}
      <Flex flex={1} direction="column" ml="10px" fontFamily="body">
        <Text fontSize="50px" lineHeight="50px" fontFamily="tech">
          {preview.name.toUpperCase()}
        </Text>
        <Text ml="5px" fontSize="15px" lineHeight="15px">
          Kandi: {preview.kandiCount}
        </Text>
        <Text ml="5px">
          {preview.description ? `"${preview.description}"` : ""}
        </Text>
      </Flex>
    </Flex>
  );
}
