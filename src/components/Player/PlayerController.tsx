"use client";

import {
  fetchPlaylistPreviews,
  fetchPlaylistSongs,
} from "@/lib/services/client/playlist";
import { PlaylistContext, PlaylistPreview, UserDonations } from "@/lib/types";
import { searchParamToPlayerState } from "@/lib/util";
import { Box, Flex, HStack, Hide } from "@chakra-ui/react";
import {
  ReactNode,
  Suspense,
  createContext,
  useContext,
  useEffect,
} from "react";
import { isError, useQuery } from "react-query";
import DiscoverModal from "../Modals/DiscoverModal";
import { usePlayer } from "../Providers/PlayerProvider";
import BottomGradientOverlay from "./BottomGradientOverlay";
import Controls from "./Controls";
import KeyEvents from "./KeyEvents";
import NowPlaying from "./NowPlaying";
import Player0 from "./Player0";
import Player1 from "./Player1";
import Player2 from "./Player2";
import { fetchUserDonations } from "@/lib/services/client/user";
import {
  BROWSE_PLAYLIST_CONTEXT_QUERY,
  PLAYLIST_PREVIEWS_QUERY,
  USER_DONATIONS_QUERY,
} from "@/lib/constants";

export type SearchParam = string | string[] | undefined;

interface PlayerControllerContext {
  playlistPreviews: PlaylistPreview[] | undefined;
  userDonations: UserDonations | undefined;
  previewsLoading: boolean;
  previewsError: boolean;
  previewsErrorMessage: any;
}

const playerControllerContext = createContext({} as PlayerControllerContext);

export const usePlayerController = () => useContext(playerControllerContext);

export default function PlayerController({
  playlistContext,
  type,
  crate,
}: {
  playlistContext: PlaylistContext;
  type: SearchParam;
  crate: SearchParam;
}) {
  const { setPlaylistContext, setBrowsePlaylistContext, setMode } = usePlayer();

  const { data: browsePlaylistData } = useQuery(
    [BROWSE_PLAYLIST_CONTEXT_QUERY, crate],
    fetchPlaylistSongs,
    {
      initialData: playlistContext,
    }
  );

  const {
    data: playlistPreviews,
    isLoading: previewsLoading,
    isError: previewsError,
    error: previewsErrorMessage,
  } = useQuery(PLAYLIST_PREVIEWS_QUERY, fetchPlaylistPreviews);

  const { data: userDonations } = useQuery(
    USER_DONATIONS_QUERY,
    fetchUserDonations
  );

  useEffect(() => {
    setPlaylistContext(playlistContext);
    setMode(searchParamToPlayerState(type));
  }, []);

  useEffect(() => {
    setBrowsePlaylistContext(browsePlaylistData);
  }, [browsePlaylistData]);

  return (
    <playerControllerContext.Provider
      value={{
        playlistPreviews,
        previewsLoading,
        previewsError,
        userDonations,
        previewsErrorMessage,
      }}
    >
      <KeyEvents />
      <PlayerControllerWrapper>
        <PlayerControllerInner playlistContext={playlistContext} />
        <PlayerSwitcher />
      </PlayerControllerWrapper>
    </playerControllerContext.Provider>
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
      return (
        <>
          <Player0 playlistContext={playlistContext} />
          <Flex display={{ base: "flex", md: "none" }}>
            <BottomGradientOverlay
              start={{ red: 255, green: 255, blue: 255, opacity: 0.5 }}
              end={{ red: 255, green: 255, blue: 255, opacity: 0 }}
            />
          </Flex>
        </>
      );
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
      return (
        <>
          <Player0 playlistContext={playlistContext} />
          <Flex display={{ base: "flex", md: "none" }}>
            <BottomGradientOverlay
              start={{ red: 255, green: 255, blue: 255, opacity: 0.5 }}
              end={{ red: 255, green: 255, blue: 255, opacity: 0 }}
            />
          </Flex>
        </>
      );
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
      w={{ base: "30px", md: "10px" }}
      h={{ base: "30px", md: "10px" }}
      bg={playerDisplayMode === circleState ? "black" : "transparent"}
      border="1px solid black"
      borderRadius="100%"
      _hover={{ cursor: "pointer" }}
      onClick={() => setMode(circleState)}
    />
  );
}
