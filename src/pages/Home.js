import { Lightning, Router, Utils } from "@lightningjs/sdk";
import ImageCell from "../components/ImageCell";
import { api_details } from "../configs/configs";
import getUpcomingMovies from "../services/getUpcomingMovies";

import Loader from "../components/loaders/Loader";
import PaginationItem from "../components/PaginationItem";

export default class Home extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 1080,
      Background: {
        w: (w) => w,
        h: (h) => h,
        rect: true,
        color: 0xff000000,
      },
      Loader: {
        w: (w) => w,
        h: (h) => h,
        type: Loader,
        visible: true,
      },
      Heading: {
        x: (w) => w / 2,
        y: 10,
        mountX: 0.5,
        mountY: 0,
        color: 0xffffffff,
        text: {
          text: "Upcoming Movies",
          fontFace: "Londrina",
          fontSize: 40,
        },
      },
      Content: {
        w: (w) => w,
        h: (h) => h - 100,
        y: 100,
        visible: false,
        MovieThumbs: {
          w: (w) => w,
          h: (h) => h - 300,
          visible: false,
          flex: {
            direction: "row",
            padding: 20,
            wrap: true,
            justifyContent: "center",
          },
        },
        Pagination: {
          y: (h) => h - 50,
          x: (w) => w / 2,
          mount: 0.5,
          w: 500,
          h: 30,
          flex: {
            direction: "row",
            padding: 0,
            wrap: true,
            justifyContent: "center",
          },
        },
      },
    };
  }

  _init() {
    this.count = 0;
    this.pageIndex = 1;
    this.focusIndex = 0; // This value varies from 0 -this.count - 1 for focusArea 0. And 0 - 1 for focusArea 1
    this.focusArea = 0; // 0 - for thumbs , 1 - for page navigation
    this.attachPagination();
  }

  attachPagination() {
    this.tag("Content.Pagination").children = ["Prev", "Next"].map(
      (item, index) => ({
        w: ["Prev", "Next"].includes(item) ? 100 : 75,
        h: (h) => h,
        type: PaginationItem,
        text: item,
      })
    );
  }

  _onDataProvided() {
    this.count = this.data.results.length;
    if (this.data.results.length) {
      this.tag("Loader").patch({ visible: false });
      this.tag("Content").patch({ visible: true });
      this.tag("Content.MovieThumbs").patch({ visible: true });
      this.tag("Content.MovieThumbs").children = this.data.results.map(
        (item, index) => ({
          margin: 20,
          h: 270,
          w: 180,
          type: ImageCell,
          src: item?.poster_path
            ? `${api_details.image_url}/w500${item.poster_path}`
            : Utils.asset(`images/fallback-poster-image.png`),
          imageId: item.id,
          number: index + 1,
          text: item.original_title,
          flexItem: { margin: 10 },
          movieId: item.id,
        })
      );
      this._refocus();
    }
  }

  _handleRight() {
    if (this.focusArea == 0 && this.focusIndex < this.count - 1) {
      this.focusIndex++;
    } else if (this.focusArea == 0 && this.focusIndex >= this.count - 1) {
      this.focusIndex = 0;
      this.focusArea = 1;
    } else if (this.focusArea == 1 && this.focusIndex < 1) {
      this.focusIndex++;
    }
  }

  _handleLeft() {
    if (this.focusArea == 0 && this.focusIndex > 0) {
      this.focusIndex--;
    } else if (this.focusArea == 1 && this.focusIndex <= 0) {
      this.focusIndex = this.count - 1;
      this.focusArea = 0;
    } else if (this.focusArea == 1 && this.focusIndex > 0) {
      this.focusIndex--;
    }
  }

  _handleEnter() {
    if (this.focusArea == 0) {
      Router.navigate(
        `movie/${
          this.tag("Content.MovieThumbs").children[this.focusIndex].movieId
        }`
      );
    } else if (
      this.focusArea == 1 &&
      !(this.focusIndex == 1 && this.data.page == this.data.total_pages) &&
      !(this.focusIndex == 0 && this.data.page == 1)
    ) {
      this.tag("Loader").patch({ visible: true });
      this.tag("Content.MovieThumbs").patch({ visible: false });
      getUpcomingMovies(this.data.page + [-1, 1][this.focusIndex]).then(
        (data) => {
          this.data = data;
          this._onDataProvided();
        }
      );
    }
  }

  _handleDown() {
    if (this.focusArea == 0) {
      // Get total rows
      let rows = Math.floor(
        this.count / 9 + (this.count % 9 == 0 ? 0 : 1)
      ); // This can be 1,2,3
      // Get current focused row
      let focusedRow = Math.floor(this.focusIndex / 9 + 1); // This can be 1,2,3
      // If there are rows below the focusedRow then navigate to it, else go to the pagination
      if (focusedRow < rows) {
        // This means that we have a next row and the current row has 9 elements
        // Get focused index ratio in current row
        let currentRowFocusIndexRatio = (this.focusIndex % 9) / 9;
        // The next row item which has to be activated should have the same index ratio
        // Get count of elemnts in next row
        let remainingRowsCount = rows - focusedRow;
        let nextRowItemCount =
          remainingRowsCount > 1 ? 9 : this.count - 9 * focusedRow;
        let nextRowFocusIndex =
          currentRowFocusIndexRatio * nextRowItemCount;
        this.focusIndex = Math.floor(focusedRow * 9 + nextRowFocusIndex);
      } else {
        this.focusIndex = 0;
        this.focusArea = 1;
      }
    } else if (this.focusArea == 1 && this.focusIndex < 1) {
      this.focusIndex++;
    }
  }

  _handleUp() {
    if (this.focusArea == 0) {
      // Get total rows
      let rows = Math.floor(
        this.count / 9 + (this.count % 9 == 0 ? 0 : 1)
      ); // This can be 1,2,3
      // Get current focused row
      let focusedRow = Math.floor(this.focusIndex / 9 + 1); // This can be 1,2,3
      // if we are at the first row then no need to procced else navigate to previous row
      if (focusedRow > 1) {
        // This means that we have a previous row and the previous row has 9 elements
        // The previous row item which has to be activated should have the same index ratio
        // Get count of elemnts in current row
        let remainingRowsCount = rows - focusedRow;
        let currentRowItemCount =
          remainingRowsCount > 0 ? 9 : this.count % 9;
        let currentRowFocusItemIndexRatio =
          (this.focusIndex % 9) / currentRowItemCount;
        let previousRowFocusIndex = currentRowFocusItemIndexRatio * 9;
        this.focusIndex = Math.floor(
          (focusedRow - 1) * 9 - 9 + previousRowFocusIndex
        );
      }
    } else if (this.focusArea == 1) {
      this.focusArea = 0;
      this.focusIndex = this.count - 1;
    }
  }

  _getFocused() {
    if (this.focusArea == 0) {
      return this.tag("Content.MovieThumbs").children[this.focusIndex];
    } else if (this.focusArea == 1) {
      return this.tag("Content.Pagination").children[this.focusIndex];
    }
  }
}
