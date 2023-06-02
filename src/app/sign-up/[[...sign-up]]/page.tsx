"use client";

import styleConstants from "@/lib/chakra/styleConstants";
import { Flex } from "@chakra-ui/react";
import { SignUp } from "@clerk/nextjs";
import React from "react";

export default function Page() {
  return (
    <Flex
      h={`calc(100vh - ${styleConstants.headerHeight})`}
      position="relative"
      top={styleConstants.headerHeight}
      align="center"
      justify="center"
    >
      <SignUp />
    </Flex>
  );
}
