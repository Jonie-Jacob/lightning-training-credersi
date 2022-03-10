import Home from "../pages/Home";
import Details from "../pages/Details";
import getUpcomingMovies from "../services/getUpcomingMovies";
import getMovieDetails from "../services/getMovieDetails";
import getMovieImages from "../services/getMovieImages";

export default {
  root: "home",
  routes: [
    {
      path: "home",
      component: Home,
      after(page) {
        return new Promise((resolve, reject) => {
          getUpcomingMovies().then((json) => {
            page.data = json;
            resolve();
          });
        });
      },
    },
    {
      path: "movie/:id",
      component: Details,
      async after(page, { id }) {
        page.data = {
          details: await getMovieDetails(id),
          images: await getMovieImages(id),
        };
      },
    },
  ],
};
