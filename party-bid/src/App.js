import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Party from "./views/party";
import CreateParty from "./views/create_party";

export default function App() {
  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      <Routes>
        <Route path="/party" element={<Party />} />
        <Route path="/create" element={<CreateParty />} />
      </Routes>
    </>
  );
}
