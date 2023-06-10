import { PlaylistPreview } from "@/lib/types";
import { msToTime } from "@/lib/util";
import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  Text,
  list,
} from "@chakra-ui/react";
import Image from "next/image";
import { usePlaylistPreviews } from "../Player/PlayerController";
import { useModal } from "../Providers/ModalProvider";
import { useEffect, useState } from "react";
import { usePlayer } from "../Providers/PlayerProvider";
import usePlaylistBrowser from "@/lib/hooks/usePlaylistBrowser";

export default function DiscoverModal() {
  const { playlistPreviews, isLoading, isError } = usePlaylistPreviews();
  const [displayedPreviews, setDisplayedPreviews] = useState(playlistPreviews);
  const [search, setSearch] = useState("");
  const { discoverModal, setDiscoverModal } = useModal();

  const filterByMatch = (list: PlaylistPreview[] | undefined) => {
    if (!list) return [];
    return list?.filter((preview) => preview.name.startsWith(search));
  };

  useEffect(() => {
    setDisplayedPreviews(filterByMatch(playlistPreviews));
  }, [playlistPreviews, search]);

  if (isLoading || isError) return null;

  return (
    <Drawer
      isOpen={discoverModal}
      onClose={() => setDiscoverModal(false)}
      placement="right"
      size="xl"
    >
      <DrawerOverlay />
      <DrawerContent bg="bg" pl="10px" w="100%">
        <DrawerCloseButton color="white" zIndex={5} />
        <Flex flex={1} direction="column" overflowY="scroll" bg="black">
          {displayedPreviews?.map((preview) => (
            <ScrollPiece key={preview.id} preview={preview} />
          ))}
        </Flex>
      </DrawerContent>
    </Drawer>
  );
}

function ScrollPiece({ preview }: { preview: PlaylistPreview }) {
  const { browse } = usePlaylistBrowser();
  const { setDiscoverModal } = useModal();

  const handleSelect = () => {
    browse(preview.routeAlias);
    setDiscoverModal(false);
  };

  return (
    <Flex
      flex={1}
      w="100%"
      h="200px"
      maxH="200px"
      direction="row"
      p="10px"
      color="white"
      _hover={{ cursor: "pointer", transform: "scale(1.03)" }}
      transition="0.3s"
      //   fontFamily="tech"
      onClick={handleSelect}
    >
      <Image
        src={preview.imageUrl ?? ""}
        alt="Playlist Cover"
        width={200}
        height={200}
        quality={90}
      />
      <Flex flex={1} direction="column" ml="10px">
        <Text fontSize="50px" lineHeight="50px" noOfLines={2}>
          {preview.name}
        </Text>
        <Text ml="3px" fontSize="20px" lineHeight="25px">
          Kandi: {preview.kandiCount}
        </Text>
        <Text ml="3px" fontSize="20px" lineHeight="25px">
          Duration: {msToTime(preview.totalDuration)}
        </Text>
      </Flex>
    </Flex>
  );
}
