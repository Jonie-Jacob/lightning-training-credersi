import { Lightning } from "@lightningjs/sdk";

export default class MediumLoader extends Lightning.Component {
  static _template() {
    return {
      w: (w) => w,
      h: (h) => h,
      Blur: {
        rect: true,
        w: (w) => w,
        h: (h) => h,
        Background: {
          w: (w) => w,
          h: (h) => h,
          rect: true,
          color: 0xff000000,
        },
        RoundRectangle: {
          mount: 0.5,
          x: (w) => w / 2,
          y: (h) => h / 2,
          pivot: 0.5,
          rotation: 0,
          texture: lng.Tools.getRoundRect(
            40,
            40,
            20,
            2,
            0xff00ffff,
            false,
            0xff000000
          ),
          colorTop: 0xffff0000,
        },
      },
    };
  }

  _init() {
    let rotationValues = {};
    for (let i = 0; i <= 1; i += 0.005) {
      rotationValues[i] = Math.PI * 2 * i;
    }
    this.tag("Blur.RoundRectangle")
      .animation({
        duration: 0.5,
        repeat: -1,
        actions: [
          {
            p: "rotation",
            v: rotationValues,
          },
        ],
      })
      .start();
  }
}
