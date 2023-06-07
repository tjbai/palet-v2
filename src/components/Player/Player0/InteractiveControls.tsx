import Kandi from "@/components/Common/Kandi";
import { usePlayer } from "@/components/Providers/PlayerProvider";
import useKandi from "@/lib/hooks/useKandi";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  VStack,
  color,
  useToast,
} from "@chakra-ui/react";
import { MouseEventHandler, ReactNode } from "react";
import {
  RiSkipBackFill,
  RiPlayFill,
  RiSkipForwardFill,
  RiRepeatFill,
} from "react-icons/ri";

const SECTION_SHADOW =
  "-1.78304px -1.78304px 0px #f0eded, -3.56608px -3.56608px 3.56608px #e0e0e0, inset -1.78304px -1.78304px 0px #f0eded, inset -3.56608px -3.56608px 3.56608px #C9D9E8;";

export default function InteractiveControls() {
  return (
    <Flex w="100%" flex={1}>
      <Flex flex={3} direction="row" pt="20px">
        <Flex direction="column" h="100%" flex={2}>
          <DiscoveryModeSwitcherButtons />
        </Flex>
        <Flex direction="column" flex={7}>
          <GeneralControlButtons />
          <ModularControlButtons />
        </Flex>
      </Flex>
      <Flex flex={2} pt="20px" pl="15px" maxW="40%" direction="column">
        <Speaker />
        <KandiButton />
      </Flex>
    </Flex>
  );
}

const Speaker = () => {
  const rows = 10;
  const cols = 10;
  const circleSize = "5px";

  const edgeDist = (r: number, c: number) => {
    return Math.min(rows - r, r + 1) + 2 * Math.min(cols - c, c + 1);
  };

  return (
    <VStack
      direction="column"
      mr="10px"
      align="center"
      justify="center"
      spacing="2px"
      p="15px"
      boxShadow={SECTION_SHADOW}
      borderRadius="15px"
      mb="20px"
    >
      {Array.from({ length: rows }).map((_, r) => (
        <HStack key={r} spacing="3px">
          {Array.from({ length: cols }).map((_, c) => (
            <Box
              h={circleSize}
              w={circleSize}
              bg="black"
              borderRadius="50%"
              key={c}
              display={edgeDist(r, c) < 6 ? "none" : "flex"}
            />
          ))}
        </HStack>
      ))}
    </VStack>
  );
};

const DiscoveryModeSwitcherButtons = () => {
  return (
    <VStack
      boxShadow={SECTION_SHADOW}
      mr="15px"
      minW="80px"
      align="center"
      justify="center"
      borderRadius="15px"
      spacing={5}
      flex={1}
    >
      <ModularButtonGeneric knobColor="orange" />
      <ModularButtonGeneric knobColor="purple" />
      <ModularButtonGeneric knobColor="green" />
    </VStack>
  );
};

const GeneralControlButtons = () => {
  const { prevSong, toggle, nextSong } = usePlayer();

  return (
    <HStack
      spacing={5}
      p="10px"
      boxShadow={SECTION_SHADOW}
      flex={1}
      align="center"
      justify="center"
      borderRadius="20px"
      mb="10px"
    >
      <SmallButtonGeneric color="#B8CCE0" onClick={prevSong}>
        <Icon as={RiSkipBackFill} />
      </SmallButtonGeneric>
      <SmallButtonGeneric color="orange" onClick={toggle}>
        <Icon as={RiPlayFill} />
      </SmallButtonGeneric>
      <SmallButtonGeneric color="#B8CCE0" onClick={nextSong}>
        <Icon as={RiSkipForwardFill} />
      </SmallButtonGeneric>
      <SmallButtonGeneric color="#B8CCE0">
        <Icon as={RiRepeatFill} />
      </SmallButtonGeneric>
    </HStack>
  );
};

const ModularControlButtons = () => {
  return (
    <HStack
      spacing={5}
      p="10px"
      css={{
        boxShadow: SECTION_SHADOW,
      }}
      flex={1}
      align="center"
      justify="center"
      borderRadius="20px"
    >
      <ModularButtonGeneric innerColor="#141414" />
      <ModularButtonGeneric innerColor="#828282" />
      <ModularButtonGeneric innerColor="#B8CCE0" />
      <ModularButtonGeneric innerColor="#ECECEC" />
    </HStack>
  );
};

const SmallButtonGeneric = ({
  children,
  color,
  onClick,
}: {
  children: ReactNode;
  color: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  const toast = useToast();

  const comingSoon = () => {
    toast({
      position: "bottom",
      duration: 3000,
      description: `Coming soon!`,
      status: "warning",
      colorScheme: "linkedin",
    });
  };

  return (
    <Button
      variant="tactile"
      color={color}
      borderRadius="50%"
      h="50px"
      w="50px"
      padding={0}
      onClick={onClick ?? comingSoon}
    >
      {children}
    </Button>
  );
};

const ModularButtonGeneric = ({
  innerColor,
  knobColor,
}: {
  innerColor?: string;
  knobColor?: string;
}) => {
  return (
    <SmallButtonGeneric color="#B8CCE0">
      <Flex
        w="30px"
        h="30px"
        bg={innerColor ?? "#E1E1E1"}
        borderRadius="50%"
        align="center"
        justify="center"
        boxShadow="inset 0px 2.84468px 2.84468px rgba(0, 0, 0, 0.1)"
      >
        <Box
          w="10px"
          h="10px"
          borderRadius="50%"
          bg={knobColor ?? "white"}
          boxShadow="0px 2px 2px rgba(0,0,0,0.1)"
        />
      </Flex>
    </SmallButtonGeneric>
  );
};

const KandiButton = () => {
  const { handleDonation } = useKandi();
  const toast = useToast();

  const handleClick = () => {
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
  };

  return (
    <Button
      flex={1}
      borderRadius="6.38744e+10px"
      h="100%"
      variant="tactile"
      onClick={handleClick}
    >
      <Flex flex={1} align="center" justify="center">
        <Flex
          height="45px"
          width="45px"
          borderRadius="50%"
          bg="orange"
          boxShadow="inset 2px 2px 3px rgba(0,0,0,0.3)"
          align="center"
          justify="center"
        >
          <Flex
            height="20px"
            width="20px"
            bg="white"
            borderRadius="50%"
            align="center"
            justify="center"
            color="orange"
            fontSize="10px"
            boxShadow="0px 4px 4px rgba(0,0,0,0.1)"
          >
            K
          </Flex>
        </Flex>
      </Flex>
    </Button>
  );
};
