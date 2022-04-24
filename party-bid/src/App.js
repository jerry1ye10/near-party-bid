import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { CreateTeam, Home, Team, Teams, Governance } from "./views";
import { ChakraProvider } from "@chakra-ui/react";

export default function App() {
  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      <ChakraProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
            <Route
             path="/team/:teamId"
             element={<Team />}
             key={window.location.pathname}
           />
          <Route path="/create" element={<CreateTeam />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/gov" element={<Governance />} />
        </Routes>
      </ChakraProvider>
    </>
  );
}
