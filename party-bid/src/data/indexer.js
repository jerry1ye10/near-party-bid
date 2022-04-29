import axios from "axios";

export const indexContract = async (contract, image_url, party_name) => {
  return axios.post(
    "https://us-central1-bloc-party-a25f6.cloudfunctions.net/indexer",
    {
      contract_id: contract,
      team_id: contract,
      image_url: image_url,
      party_name: party_name,
    }
  );
};
