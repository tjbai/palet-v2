"use client";

import styleConstants from "@/lib/chakra/styleConstants";
import { Flex } from "@chakra-ui/react";
import { SignUp } from "@clerk/nextjs";
import React from "react"; // ts yells without this in the imports for some reason

export default function Page() {
  return (
    <Flex
      h={`calc(100vh - ${styleConstants.headerHeight})`}
      position="relative"
      top={styleConstants.headerHeight}
      align="center"
      justify="center"
    >
      <SignUp
        path="sign-up"
        routing="path"
        signInUrl="/sign-in"
        redirectUrl="/player"
      />
    </Flex>
  );
}
