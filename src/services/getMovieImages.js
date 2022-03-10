import { api_details } from "../configs/configs";

export default async (movieId) => {
  try {
    let response = await fetch(
      `${api_details.url}/${movieId}/images?api_key=${api_details.query_params.api_key}&language=${api_details.query_params.language}&include_image_language=en%2Cnull`
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    return {};
  }
};
