import { api_details } from "../configs/configs";

export default async (pageNo = 1) => {
  try {
    let response = await fetch(
      `${api_details.url}/upcoming?api_key=${api_details.query_params.api_key}&language=${api_details.query_params.language}&page=${pageNo}`
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    return {};
  }
};
