# AppKit: library for Opencast-related React apps

> **Important**: This is still very much work in progress!
> Expect frequent releases with breaking changes.

Library for the development of (React + TS + emotion.js)-based apps in the Opencast context.
It provides a number of React components and various other utilty features.
In order to ensure style consistency across our apps, appkit "includes" a design and is not suitable as a general purpose library;
that's the whole point: to get a pre-defined design.


## Usage

- `npm install --save @opencast/appkit`
- Make sure all of [appkit's `peerDependencies`](./package.json) are installed (should be done by NPM in the previous step).
- Provide color values, most likely by copying [`colors.css`](./src/colors.css) into your `index.html`. See "colors" section below.
- Optionally configure appkit via `AppkitConfigProvider`.

## Icons: [Lucide](https://lucide.dev/)

While this library does not ship any icons itself, apps in the Opencast context should use the same icons to ensure consistency.
Therefore, **use [Lucide icons](https://lucide.dev/)!**
There are only two exceptions: use `search` and `translate` from [Hero icons v1 (outline version)](https://v1.heroicons.com/) instead of the alternatives from Lucide.
Hint: it's convenient to use [`react-icons`](https://react-icons.github.io/react-icons/) to import all needed icons into your codebase.

Should your app require an icon that's not available in Lucide, you can create a new one (or check Hero).
This should follow [Lucide's Design Principles](https://lucide.dev/guide/design/icon-design-guide).
Unless the icon is very particular (i.e. unlikely to be useful in any other application), it should be [contributed back to Lucide](https://github.com/lucide-icons/lucide/blob/main/CONTRIBUTING.md).


## Colors

This library also contains a color scheme with a set of fixed colors.
These can be configured, but you should likely stick to the given colors as close as possible, especially the neutral ones.
See [`colors.css`](./src/colors.css): you likely want to copy that into your `index.html` directly;
also see the color color scheme section below.

### Neutral

Neutral colors that can be used throughout the design.
You may make the grey tone configurable in your app (e.g. to allow organizations to choose a slightly warm grey), but the individual colors must still have the same perceived brightness values as specified here.
(Note: perceived brightness is the same as L in the LCH color space, but NOT the same as the L in HSL!)

**Light mode**
```
             Perceived brightness  sRGB hex code
neutral00    100                   #ffffff
neutral05    99.7                  #fefefe
neutral10    95.9                  #f3f3f3
neutral15    92.0                  #e8e8e8
neutral20    88.0                  #dddddd
neutral25    83.9                  #d1d1d1
neutral30    78.0                  #c1c1c1
neutral40    67.0                  #a3a3a3
neutral50    50.0                  #777777
neutral60    37.0                  #575757
neutral70    27.0                  #404040
neutral80    17.0                  #2a2a2a
neutral90    8.0                   #181818
```

**Dark mode**
```
             Perceived brightness  sRGB hex code
neutral00    5.0                   #111111
neutral05    7.7                   #171717
neutral10    11.5                  #1e1e1e
neutral15    15.3                  #262626
neutral20    19.1                  #2e2e2e
neutral25    22.9                  #373737
neutral30    26.7                  #3f3f3f
neutral40    32.7                  #4d4d4d
neutral50    43.4                  #676767
neutral60    56.0                  #868686
neutral70    62.0                  #969696
neutral80    68.0                  #a6a6a6
neutral90    79.0                  #c4c4c4
```

### Accent color

**Light mode**
```
accent9   #044a81   lch(30.1%  37.2  266.4)
accent8   #215D99   lch(38.1%  39.1  266.2)
accent7   #3073B8   lch(46.8%  43.5  265.8)
accent6   #3E8AD8   lch(55.5%  47.8  265.0)
accent5   #4DA1F7   lch(64.0%  51.6  264.3)
accent4   #71B4F9   lch(71.0%  42.0  260.1)
```

**Dark mode**
```
accent9   #85ace3   lch(69.1%  32.5  264.7)
accent8   #7da4db   lch(66.1%  32.7  265.0)
accent7   #588ccd   lch(56.8%  39.6  265.5)
accent6   #1f72ba   lch(46.1%  45.8  264.7)
accent5   #1c619e   lch(39.4%  40.0  264.4)
accent4   #195483   lch(33.9%  32.8  260.3)
```

### Destructive color

**Light mode**
```
danger0   #feedeb   lch(95.1%   6.5  28.9)
danger1   #ffd2cd   lch(88.0%  18.0  29.1)
danger2   #feaba1   lch(78.1%  35.6  31.1)
danger4   #c22a2c   lch(44.0%  71.0  33.2)
danger5   #880e11   lch(29.0%  59.9  35.9)
```

**Dark mode**
```
danger0   #361314   lch(11.5%  19.8  24.5)
danger1   #462522   lch(19.2%  18.2  30.2)
danger2   #712f2a   lch(29.0%  35.0  31.6)
danger4   #e0584d   lch(56.1%  64.1  33.4)
danger5   #fb7c67   lch(67.1%  59.8  36.1)
```

### Happy color

By default, this is the same as the accent color.
"Happy" just means that it can be used for "call to action" and positive contexts.
All colors except red can be used in these contexts, so this color should only be changed (i.e. be different from accent) if the accent color is some kind of red.

## Color Scheme Switching

Appkit provides utlities to have multiple color schemes in your app: `useColorScheme` and `ColorSchemeProvider`.
This currently supports `light`, `dark`, `light-high-contrast` and `dark-high-contrast`.
If your app does not support high contrast modes, you can disable those.
See the [documentation on `ColorSchemeProvider`](./src/colorScheme.tsx) to understand how this system works and what you have to do to set it up.


## Local development

To work on appkit or test patches locally (i.e. whenever you can't use NPM releases), you can include like this:

- In your local `appkit` directory run `npm link` (`sudo` likely required)
- In the directory of the app you want to use appkit with,, run `npm link @opencast/appkit`

This essentially just does `ln -s /path/to/appkit /path/to/app/node_modules/@opencast/appkit`, i.e. create a symbolic link.
Whenever you run `npm ci` or `npm install` in the app's directory, that link is overwritten and replaced with the NPM version of appkit; then you have to run the second command `npm link @opencast/appkit` again.

Unfortunately, this can lead to problems with webpack and duplicated dependencies.
To avoid that, add the following to your webpack config:

```js
resolve: {
    alias: {
      "react": path.join(__dirname, "node_modules/react"),
      "@emotion/react": path.join(__dirname, "node_modules/@emotion/react"),
    },
},
```

A more in-depth explanation of why this is necessary can be found [here](https://gist.github.com/LukasKalbertodt/382cb53a85fcf6e7d1f5235625c6f4fb).
Whenever you encounter weird runtime errors complaining about imports or invalid hook calls, it could be this issue.
Then you can try adding another alias for the problematic dependency.
