/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2021 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Lightning, Colors, Img } from "@lightningjs/sdk";
import MediumLoader from "./loaders/MediumLoader";

export default class ImageCell extends Lightning.Component {
  static _template() {
    return {
      Base: {
        w: (w) => w,
        h: (h) => h,
        rect: true,
        color: 0xff000000,
      },
      rect: true,
      Shadow: {
        alpha: 0,
        mount: 0.5,
        x: (w) => w / 2,
        y: (h) => h / 2,
        w: (w) => w + 32,
        h: (h) => h + 32,
        color: Colors("shadow").get(),
        rect: true,
        shader: { type: Lightning.shaders.FadeOut, fade: 32 },
      },
      ImageWrapper: {
        w: (w) => w,
        h: (h) => h,
        rtt: true,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 4 },
        Fill: {
          w: (w) => w,
          h: (h) => h,
          color: 0xff2c2a2a,
          rect: true,
        },
        Loader: {
          alpha: 1,
          w: (w) => w,
          h: (h) => h,
          type: MediumLoader,
        },
        // Image: Img(
        //   "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg"
        // ).contain(133, 200),
        Image: {
          alpha: 0.001,
          mount: 0.5,
          y: (w) => w / 2,
          x: (h) => h / 2,
          w: (w) => w,
          h: (h) => h,
          src: this.bindProp("src"),
        },
      },
      Focus: {
        alpha: 0,
        x: 4,
        y: 4,
        w: (w) => w - 8,
        h: (h) => h - 8,
        color: 0xff000000,
        rect: true,
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 3,
          stroke: 5,
          strokeColor: 0xffffffff,
          blend: 1,
          fillColor: 0x00ffffff,
        },
      },
      Background: {
        mountX: 0.5,
        mountY: 1,
        w: (w) => w - 8,
        y: (h) => h - 8,
        x: (w) => w / 2,
        h: 25,
        rect: true,
        color: 0xff000000,
      },
      Label: {
        mountX: 0.5,
        mountY: 1,
        y: (h) => h - 5,
        x: (w) => w / 2,
        color: 0xffffffff,
        text: {
          text: this.bindProp("text"),
          fontFace: "Londrina",
          fontSize: 17,
          wordWrapWidth: 180,
          maxLinesSuffix: "...",
          // lineHeight: 62,
          maxLines: 1,
        },
      },
    };
  }

  _init() {
    const image = this.tag("ImageWrapper.Image");
    image.on("txLoaded", () => {
      this.tag("ImageWrapper.Loader").patch({ alpha: 0 });
      image.setSmooth("alpha", 1);
    });

    this._focusAnimation = this.animation({
      duration: 0.2,
      actions: [
        { p: "scale", v: { 0: 1, 1: 1.15 } },
        { t: "Shadow", p: "alpha", v: { 0: 0, 1: 1 } },
        { t: "Focus", p: "alpha", v: { 0: 0, 1: 1 } },
      ],
    });
  }

  _focus() {
    if (this._focusAnimation) {
      this._focusAnimation.start();
    }
  }

  _unfocus() {
    this._focusAnimation.stop();
  }

  static get width() {
    return 400;
  }

  static get height() {
    return 300;
  }
}
