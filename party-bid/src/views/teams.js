import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";

export const Teams = () => {
  useEffect(() => {
    fetch("https://us-central1-bloc-party-a25f6.cloudfunctions.net/searcher", {
      method: "POST",
    }).then((res) => {
      if (res.status === 200) {
        console.log(res);
      }
    });
    // fetch(
    //   "https://us-central1-bloc-party-a25f6.cloudfunctions.net/updateContract",
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       contract_id: "dev-party-123456789123456781651124922320",
    //     }),
    //   }
    // ).then((res) => {
    //   if (res.status === 200) {
    //     console.log("sucess");
    //   }
    // });
  }, []);

  return <Layout>Teams</Layout>;
};
