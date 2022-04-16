import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Button, Input } from "@chakra-ui/react";
export const CreateTeam = () => {
  const [url, set_url] = useState("");
  function createParty() {}

  return (
    <Layout>
      Enter Url:{" "}
      <Input
        type="text"
        value={url}
        onChange={(e) => {
          set_url(e.target.value);
        }}
      />
      <Button
        style={{
          justifyContent: "center",
          display: "flex",
          alignContent: "center",
        }}
        onClick={createParty}
      >
        Create Party{" "}
      </Button>
    </Layout>
  );
};
