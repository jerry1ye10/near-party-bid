import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Home, Team, Teams } from "./views";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./common/theme";
export default function App() {
  return (
    <>
      <ChakraProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route
            path="/team/:teamId"
            element={<Team />}
            key={window.location.pathname}
          />
          <Route path="/teams" element={<Teams />} />
        </Routes>
      </ChakraProvider>
    </>
  );
}
