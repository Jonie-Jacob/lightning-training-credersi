import { Lightning } from "@lightningjs/sdk";

export default class PaginationItem extends Lightning.Component {
  static _template() {
    return {
      w: (w) => w,
      h: (h) => h,
      //   color: 0xff323030,
      flexItem: { margin: 10 },
      BackGround: {
        w: (w) => w,
        h: (h) => h,
        rect: true,
        color: 0xff000000,
      },
      RoundRectangle: {
        w: (w) => w,
        h: (h) => h,
        texture: lng.Tools.getRoundRect(
          100,
          120,
          2,
          6,
          0x11ffffff,
          true,
          0x00000000
        ),
      },
      Text: {
        w: (w) => w,
        h: (h) => h,
        text: {
          text: this.bindProp("text"),
          textColor: 0xffffffff,
          textAlign: "center",
          fontFace: "Londrina",
          fontSize: 20,
        },
      },
    };
  }

  _focus() {
    this.tag("BackGround").patch({ color: 0x11ffffff });
  }

  _unfocus() {
    this.tag("BackGround").patch({ color: 0xff000000 });
  }
}
