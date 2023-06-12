import { PlaylistPreview } from "@/lib/types";
import { msToTime } from "@/lib/util";
import {
  Box,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useModal } from "../Providers/ModalProvider";
import { usePlayerController } from "../Player/PlayerController";
import { usePlayer } from "../Providers/PlayerProvider";
import styleConstants from "@/lib/chakra/styleConstants";

export default function DiscoverModal() {
  const { playlistPreviews, previewsLoading, previewsError } =
    usePlayerController();
  const [search, setSearch] = useState("");
  const { discoverModal, setDiscoverModal } = useModal();

  const filterByMatch = (list: PlaylistPreview[] | undefined) => {
    if (!list) return [];
    return list?.filter((preview) => preview.name.startsWith(search));
  };

  // useEffect(() => {
  //   setDisplayedPreviews(filterByMatch(playlistPreviews));
  // }, [playlistPreviews, search]);

  if (previewsLoading || previewsError) return null;

  return (
    <Drawer
      isOpen={false}
      onClose={() => setDiscoverModal(false)}
      placement="left"
      size="full"
      blockScrollOnMount
      preserveScrollBarGap
    >
      {/* <DrawerOverlay /> */}
      <DrawerContent w="100%" bg="transparent" p={0}>
        {/* <DrawerCloseButton color="white" zIndex={5} /> */}
        <Flex
          flex={1}
          direction="column"
          overflowY="scroll"
          bg="transparent"
          pr="10px"
        >
          <Flex
            maxW="40%"
            position="relative"
            h={`calc(100vh - ${styleConstants.headerHeight} - 30px)`}
            top={styleConstants.headerHeight}
            overflowX="scroll"
            direction="column"
            bg="black"
            borderRightRadius="10px"
            boxShadow="inset -5px -5px 20px rgba(255,255,255,0.4)"
          >
            {/* <Flex flex={1} direction="column" border="1px solid red"> */}
            {playlistPreviews?.map((preview) => (
              <ScrollPiece key={preview.id} preview={preview} />
            ))}
            {/* </Flex> */}
          </Flex>
        </Flex>
      </DrawerContent>
    </Drawer>
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
      h="200px"
      maxH="200px"
      direction="row"
      p="10px"
      color="white"
      _hover={{ cursor: "pointer" }}
      transition="0.3s"
      onClick={handleSelect}
      bg="black"
      boxShadow="inset -10px 0px 8px -5px rgba(255,255,255,0.4)"
    >
      {preview.imageUrl ? (
        <Image
          src={preview.imageUrl ?? ""}
          alt="Playlist Cover"
          width={200}
          height={200}
          quality={90}
        />
      ) : (
        <Box w="200px" h="200px" />
      )}
      <Flex flex={1} direction="column" ml="10px">
        <Text fontSize="50px" lineHeight="50px" noOfLines={2}>
          {preview.name}
        </Text>
        <Text ml="3px" fontSize="15px" lineHeight="25px">
          Kandi: {preview.kandiCount}
        </Text>
        <Text ml="3px" fontSize="15px" lineHeight="25px">
          Duration: {msToTime(preview.totalDuration)}
        </Text>
      </Flex>
    </Flex>
  );
}
