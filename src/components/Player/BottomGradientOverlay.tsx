import { Box } from "@chakra-ui/react";

export interface RgbColor {
  red: number;
  green: number;
  blue: number;
  opacity: number;
}

export default function BottomGradientOverlay({
  start,
  end,
}: {
  start: RgbColor;
  end: RgbColor;
}) {
  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      width="100%"
      height="100%"
      zIndex={4}
      pointerEvents="none"
    >
      <Box
        position="absolute"
        bottom={0}
        left={0}
        width="100%"
        height="100%"
        background={`linear-gradient(to top, 
          rgba(${start.red},${start.green},${start.blue},${start.opacity}) 0%, 
          rgba(${end.red},${end.green},${end.blue},${end.opacity}) 20%)`}
      />
    </Box>
  );
}
