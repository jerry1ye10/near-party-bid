import React, { useEffect, useState } from "react";
import { login, logout } from "../utils";
import { Button } from "@chakra-ui/react";

export default function LoginView() {
  if (window.walletConnection.isSignedIn()) {
    return (
      <Button className="link" style={{ float: "right" }} onClick={login}>
        Sign In
      </Button>
    );
  }
  return (
    <Button className="link" style={{ float: "right" }} onClick={logout}>
      Sign out
    </Button>
  );
}
