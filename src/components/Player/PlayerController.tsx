"use client";

import { PlaylistContext } from "@/lib/hooks/usePlayerState";
import Player1 from "./Player1";
import Player2 from "./Player2";
import { usePlayer } from "../Providers/PlayerProvider";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Box, Flex, HStack } from "@chakra-ui/react";
import BottomGradientOverlay from "./BottomGradientOverlay";
import { useRouter } from "next/navigation";

type SearchParam = string | string[] | undefined;

export default function PlayerController({
  playlistContext,
  typeSearchParam,
}: {
  playlistContext: PlaylistContext;
  typeSearchParam: SearchParam;
}) {
  const { setPlaylistContext } = usePlayer();
  const [playerState, setPlayerState] = useState<number>(1);

  const searchParamToPlayerState = (type: SearchParam) => {
    if (!type || type === "1" || Array.isArray(type)) return 1;
    else if (type === "2") return 2;
    return 1; // default for now
  };

  useEffect(() => {
    setPlaylistContext(playlistContext!);
    setPlayerState(searchParamToPlayerState(typeSearchParam));
  }, []);

  return (
    <PlayerControllerWrapper>
      <PlayerControllerInner
        playlistContext={playlistContext}
        playerState={playerState}
      />
      <PlayerSwitcher
        playerState={playerState}
        setPlayerState={setPlayerState}
      />
    </PlayerControllerWrapper>
  );
}

function PlayerControllerWrapper({ children }: { children: ReactNode }) {
  return <Flex h="100vh">{children}</Flex>;
}

function PlayerControllerInner({
  playlistContext,
  playerState,
}: {
  playlistContext: PlaylistContext;
  playerState: number;
}) {
  switch (playerState) {
    case 1:
      return (
        <>
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
          <Player2 playlistContext={playlistContext} />
          <BottomGradientOverlay
            start={{ red: 255, green: 255, blue: 255, opacity: 0.5 }}
            end={{ red: 255, green: 255, blue: 255, opacity: 0 }}
          />
        </>
      );
    default:
      return <Player1 playlistContext={playlistContext} />;
  }
}

function PlayerSwitcher({
  playerState,
  setPlayerState,
}: {
  playerState: number;
  setPlayerState: Dispatch<SetStateAction<number>>;
}) {
  return (
    <Box
      position="fixed"
      bottom="20px"
      left="50%"
      transform={"translateX(-50%)"}
      bg=""
      zIndex={5}
    >
      <HStack>
        <PlayerCircle
          circleState={1}
          playerState={playerState}
          setPlayerState={setPlayerState}
        />
        <PlayerCircle
          circleState={2}
          playerState={playerState}
          setPlayerState={setPlayerState}
        />
      </HStack>
    </Box>
  );
}

function PlayerCircle({
  playerState,
  circleState,
  setPlayerState,
}: {
  playerState: number;
  circleState: number;
  setPlayerState: Dispatch<SetStateAction<number>>;
}) {
  const router = useRouter();
  const switchPlayerState = () => {
    router.push(`/player?type=${circleState}`);
    setPlayerState(circleState);
  };

  return (
    <Box
      w="10px"
      h="10px"
      bg={playerState === circleState ? "black" : "transparent"}
      border="1px solid black"
      borderRadius="100%"
      _hover={{ cursor: "pointer" }}
      onClick={switchPlayerState}
    />
  );
}
