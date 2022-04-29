import React, { useEffect, useState } from "react";
import nearAPI from "near-api-js";
import { Layout } from "../components/Layout";

export const Teams = () => {
  //Returns list of parties with their data
  useEffect(() => {
    fetch("https://us-central1-bloc-party-a25f6.cloudfunctions.net/searcher", {
      method: "POST",
    }).then((res) => {
      if (res.status === 200) {
      }
    });
  }, []);

  return <Layout>Teams</Layout>;
};
