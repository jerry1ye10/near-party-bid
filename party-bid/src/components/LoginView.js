import React, { useEffect, useState } from "react";
import { login, logout } from "../utils";

export default function LoginView() {
  if (window.walletConnection.isSignedIn()) {
    return (
      <button className="link" style={{ float: "right" }} onClick={login}>
        Sign In
      </button>
    );
  }
  return (
    <button className="link" style={{ float: "right" }} onClick={logout}>
      Sign out
    </button>
  );
}
