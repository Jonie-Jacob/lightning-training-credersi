import { Lightning, Img, Router, Utils } from "@lightningjs/sdk";
import Loader from "../components/loaders/Loader";
import { api_details } from "../configs/configs";

export default class Details extends Lightning.Component {
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
      Content: {
        w: (w) => w,
        h: (h) => h,
        visible: false,
        Background: {
          w: (w) => w,
          h: (h) => h,
          rect: true,
          color: 0xff000000,
        },
        BackgroundImage: {
          x: (w) => w,
          y: 0,
          mountX: 1,
          alpha: 0,
          w: 1600,
          h: 900,
          texture: {},
          transitions: {
            alpha: { duration: 0.5, timingFunction: "ease" },
          },
        },
        ImageOverlayHorizontal: {
          x: 320,
          y: 0,
          mountX: 0,
          w: 1600,
          h: 900,
          rect: true,
          colorLeft: 0xff000000,
          colorRight: 0x00ffffff,
        },
        ImageOverlayVertical: {
          x: 320,
          y: (h) => h - 180,
          mountY: 1,
          w: 1600,
          h: 450,
          rect: true,
          colorTop: 0x00ffffff,
          colorBottom: 0xff000000,
        },
        BannerText: {
          x: 50,
          y: 350,
          alpha: 0,
          transitions: {
            alpha: { duration: 0.5, timingFunction: "ease" },
          },
          BannerTitle: {
            x: 0,
            y: 0,
            text: {
              text: "Survivor Australia XXXXXX XXXXXX XXXXXXXX XXXXXX XXXXXX XXXXX XXXXX",
              fontFace: "Regular",
              fontSize: 64,
              wordWrapWidth: 1000,
              maxLinesSuffix: "...",
              lineHeight: 62,
              maxLines: 1,
              textColor: 0xffffffff,
            },
          },
          MetaData: {
            x: 0,
            y: 85,
            text: {
              text: "17:30 - 19:00 SEASON 8 | 13L | ALL SHOWS, ADVENTURE, OTHER",
              fontFace: "Regular",
              fontSize: 20,
              textColor: 0xff757575,
            },
          },
          Genres: {
            x: 0,
            y: 125,
            Title: {
              x: 0,
              y: 0,
              text: {
                text: "Genres : ",
                fontFace: "Regular",
                fontSize: 20,
                textColor: 0xffffa400,
              },
            },
            Content: {
              x: 80,
              y: 0,
              text: {
                text: "",
                fontFace: "Regular",
                fontSize: 20,
                textColor: 0xffd8a549,
              },
            },
          },
          Production: {
            x: 0,
            y: 170,
            Title: {
              x: 0,
              y: 0,
              text: {
                text: "Produced By : ",
                fontFace: "Regular",
                fontSize: 20,
                textColor: 0xffa3f900,
              },
            },
            Content: {
              x: 140,
              y: 0,
              text: {
                text: "",
                fontFace: "Regular",
                fontSize: 20,
                textColor: 0xffbaf053,
              },
            },
          },
          Description: {
            x: 0,
            y: 215,
            text: {
              text: "'S2/E60'. Dineo and Msizi make new years resolutions for the year ahead as they have a very special night in. Ramon's condition deteriorates as his family and Gordon prepare for the worst. XXXXXXX X xxxxx xXXXXXXXX XXXX XXXXXX XXXXXXX X xxxxx xXXXXXXXX XXXX XXXXXX XXXXXXX X xxxxx xXXXXXXXX XXXX XXXXXX XXXXXXX X xxxxx xXXXXXXXX XXXX XXXXXX XXXXXXX X xxxxx xXXXXXXXX XXXX XXXXXX XXXXXXX X xxxxx xXXXXXXXX XXXX XXXXXX XXXXXXX X xxxxx xXXXXXXXX XXXX XXXXXX XXXXXXX X xxxxx xXXXXXXXX XXXX XXXXXX XXXXXXX X xxxxx xXXXXXXXX XXXX XXXXXX ",
              fontFace: "Regular",
              wordWrapWidth: 800,
              maxLinesSuffix: "...",
              lineHeight: 40,
              maxLines: 6,
              fontSize: 20,
              textColor: 0xffffffff,
            },
          },
        },
      },
      Back: {
        x: (w) => w - 10,
        y: (y) => y - 10,
        mount: 1,
        text: {
          text: "Press 'Esc' to go back",
          fontFace: "Regular",
          fontSize: 20,
          textColor: 0xffff4904,
        },
      },
    };
  }

  _onDataProvided() {
    if (this.data) {
      this.tag("Content.BannerText").setSmooth("alpha", 0, {
        duration: 0.2,
        timingFunction: "ease-out",
      });
      this.tag("Content.BackgroundImage")
        .setSmooth("alpha", 0, {
          duration: 0.2,
          timingFunction: "ease-out",
        })
        .once("finish", () => {
          this.tag("Content.BannerText.BannerTitle").patch({
            text: { text: this.data.details.title },
          });
          this.tag("Content.BannerText.Description").patch({
            text: { text: this.data.details.overview },
          });
          this.tag("Content.BannerText.Genres.Content").patch({
            text: {
              text: this.data.details.genres
                .map((genre) => genre.name)
                .join(", "),
            },
          });
          this.tag("Content.BannerText.Production.Content").patch({
            text: {
              text: this.data.details.production_companies
                .map((pro) => pro.name)
                .join(" | "),
            },
          });
          this.tag("Content.BannerText.MetaData").patch({
            text: {
              text: `${this.data.details.release_date} | ${
                this.data.details.runtime
              } min | ${this.data.details.spoken_languages
                .map((lan) => lan.english_name)
                .join(", ")}`,
            },
          });
          this.tag("Content.BackgroundImage").patch({
            texture: Img(
              this.data?.images?.backdrops[0]?.file_path
                ? `${api_details.image_url}/original${this.data.images.backdrops[0].file_path}`
                : Utils.asset(`images/fallback-banner-image.jpg`)
            ).cover(1600, 900),
          });
          this.tag("Loader").patch({ visible: false });
          this.tag("Content").patch({ visible: true });
          this.tag("Content.BackgroundImage").setSmooth("alpha", 1, {
            duration: 0.2,
            timingFunction: "ease-in",
          });
          this.tag("Content.BannerText").setSmooth("alpha", 1, {
            duration: 0.2,
            timingFunction: "ease-in",
          });
        });
    }
  }

  _handleKey(event) {
    if (event.keyCode == 27) {
      this.tag("Loader").patch({ visible: true });
      this.tag("Content").patch({ visible: false });
      Router.navigate("home");
    }
  }
}
