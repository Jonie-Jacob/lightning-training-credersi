import { api_details } from "../configs/configs";

export default async (movieId, pageNo = 1) => {
  try {
    let response = await fetch(
      `${api_details.url}/${movieId}/similar?api_key=${api_details.query_params.api_key}&language=${api_details.query_params.language}&page=${pageNo}`
    );
    return (await response.json()).data;
  } catch (error) {
    console.error(error);
    return {};
  }
};
