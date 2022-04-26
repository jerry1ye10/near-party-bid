import React, { useEffect, useState } from "react";
import { login, logout } from "../utils";
import { Button, Text, Box } from "@chakra-ui/react";
import { BiWallet } from "react-icons/bi";

export default function LoginView() {
  console.log(window.walletConnection.isSignedIn());
  if (!window.walletConnection.isSignedIn()) {
    return (
      <Button variant="primary" style={{ float: "right" }} onClick={login}>
        <Box display={["none", null, "unset"]}>
          <Text>Connect Wallet</Text>
        </Box>
        <Box display={["unset", null, "none"]}>
          <BiWallet size={"20px"} />
        </Box>
      </Button>
    );
  }
  return (
    <Button variant="outline" style={{ float: "right" }} onClick={logout}>
      <Box display={["none", null, "unset"]}>
        <Text>Disconnect Wallet</Text>
      </Box>
      <Box display={["unset", null, "none"]}>
        <BiWallet size={"20px"} />
      </Box>
    </Button>
  );
}
