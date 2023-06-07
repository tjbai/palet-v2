"use client";

import useKandi from "@/lib/hooks/useKandi";
import { PlaylistContext } from "@/lib/types";
import { searchParamToPlayerState } from "@/lib/util";
import { Box, Flex, HStack, useToast } from "@chakra-ui/react";
import axios from "axios";
import { ReactNode, Suspense, useEffect } from "react";
import { QueryFunctionContext, useQuery } from "react-query";
import Kandi from "../Common/Kandi";
import { usePlayer } from "../Providers/PlayerProvider";
import BottomGradientOverlay from "./BottomGradientOverlay";
import Controls from "./Controls";
import NowPlaying from "./NowPlaying";
import Player0 from "./Player0";
import Player1 from "./Player1";
import Player2 from "./Player2";

export type SearchParam = string | string[] | undefined;

export default function PlayerController({
  playlistContext,
  type,
  crate,
}: {
  playlistContext: PlaylistContext;
  type: SearchParam;
  crate: SearchParam;
}) {
  const {
    setPlaylistContext,
    setBrowsePlaylistContext,
    setMode,
    prevMode,
    nextMode,
  } = usePlayer();
  const { handleDonation } = useKandi();
  const toast = useToast();

  const fetchPlaylistSongs = async ({
    queryKey,
  }: QueryFunctionContext<SearchParam[], any>) => {
    console.log("revalidating");
    const [_, routeAlias] = queryKey;

    if (!routeAlias) return null;

    const { data } = await axios.post("/api/track/getForPlaylist", {
      routeAlias,
    });

    if (data.error) return null;
    return data.playlistContext;
  };

  const { data: browsePlaylistData } = useQuery(
    ["browsePlaylistContext", crate],
    fetchPlaylistSongs,
    {
      initialData: playlistContext,
    }
  );

  useEffect(() => {
    setBrowsePlaylistContext(browsePlaylistData);
  }, [browsePlaylistData]);

  useEffect(() => {
    setPlaylistContext(playlistContext);
    setMode(searchParamToPlayerState(type));

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleDonation();

        toast({
          position: "bottom-right",
          duration: 1000,
          description: "Received donation request!",
          containerStyle: {
            padding: "0px",
            width: "fit-content",
            alignItems: "flex-end",
            display: "flex",
            justifyContent: "flex-end",
          },
          render: () => (
            <Flex fontSize="30px">
              <Kandi size={40} />
            </Flex>
          ),
        });
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        prevMode();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        nextMode();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <PlayerControllerWrapper>
      <PlayerControllerInner playlistContext={playlistContext} />
      <Suspense fallback={null}>
        <PlayerSwitcher />
      </Suspense>
    </PlayerControllerWrapper>
  );
}

function PlayerControllerWrapper({ children }: { children: ReactNode }) {
  return <Flex h="100vh">{children}</Flex>;
}

function PlayerControllerInner({
  playlistContext,
}: {
  playlistContext: PlaylistContext;
}) {
  const { playerDisplayMode } = usePlayer();

  switch (playerDisplayMode) {
    case 0:
      return <Player0 playlistContext={playlistContext} />;
    case 1:
      return (
        <>
          <NowPlaying />
          <Player1 playlistContext={playlistContext} />
          <BottomGradientOverlay
            start={{ red: 255, green: 255, blue: 255, opacity: 0.5 }}
            end={{ red: 255, green: 255, blue: 255, opacity: 0 }}
          />
        </>
      );
    case 2:
      return (
        <>
          <NowPlaying />
          <Player2 playlistContext={playlistContext} />
          <BottomGradientOverlay
            start={{ red: 255, green: 255, blue: 255, opacity: 0.8 }}
            end={{ red: 255, green: 255, blue: 255, opacity: 0 }}
            percentCover={30}
          />
        </>
      );
    default:
      return <Player0 playlistContext={playlistContext} />;
  }
}

/*
Should probably make this more clear, but PlayerSwitcher also takes on 
Controls functionality at smaller screen sizes.

There's lowkey some really hidden things going on here to make this
work at different resolutions but we can always refactor that.

Just note that the Controls, ClickIcon, and NowPlaying
components are ALL coupled with the same logic.
*/

function PlayerSwitcher() {
  return (
    <Flex
      position="fixed"
      bottom="10px"
      left="50%"
      transform={"translateX(-50%)"}
      bg=""
      zIndex={20}
      w="100%"
      align="center"
      justify="center"
    >
      <HStack flex={1} align="center" justify="center">
        <PlayerCircle circleState={0} />
        <PlayerCircle circleState={1} />
        <PlayerCircle circleState={2} />
        <Flex w="20%" display={{ base: "flex", md: "none" }} />
        <Flex
          display={{ base: "flex", md: "none" }}
          align="center"
          justify="center"
        >
          <Controls />
        </Flex>
      </HStack>
    </Flex>
  );
}

function PlayerCircle({ circleState }: { circleState: number }) {
  const { setMode, playerDisplayMode } = usePlayer();

  return (
    <Box
      w={{ base: "20px", md: "10px" }}
      h={{ base: "20px", md: "10px" }}
      bg={playerDisplayMode === circleState ? "black" : "transparent"}
      border="1px solid black"
      borderRadius="100%"
      _hover={{ cursor: "pointer" }}
      onClick={() => setMode(circleState)}
    />
  );
}
