import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Home, Bloc, Blocs, Marketplace } from "./views";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./common/theme";
export default function App() {
  return (
    <>
      <ChakraProvider theme={theme}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/bloc" element={<Bloc />} />
          <Route path="/bloc/:teamId" element={<Bloc />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/blocs" element={<Blocs />} />
        </Routes>
      </ChakraProvider>
    </>
  );
}
