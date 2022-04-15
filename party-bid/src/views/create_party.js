import React, { useEffect, useState } from "react";
export default function CreateParty() {
  const [url, set_url] = useState("");
  function createParty() {}

  return (
    <>
      Enter Url:{" "}
      <input
        type="text"
        value={url}
        onChange={(e) => {
          set_url(e.target.value);
        }}
      />
      <button
        style={{
          justifyContent: "center",
          display: "flex",
          alignContent: "center",
        }}
        onClick={createParty}
      >
        Create Party{" "}
      </button>
    </>
  );
}
