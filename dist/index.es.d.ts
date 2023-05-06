/// <reference types="react" />
import React from "react";
declare const _default: React.ForwardRefExoticComponent<{
    style?: React.CSSProperties | undefined;
    className?: string | undefined;
} & React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
/* ┐
│ File: types.d.ts [/src/bits/controls/types.d.ts]
│ Package: @rs1/media-player | RS1 Project
│ Author: Andrea Corsini
│ Created: April 28th, 2023 - 17:47:45
│ Modified: May 3rd, 2023 - 16:41:38
│
│ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
│ This work is licensed under the terms of the MIT License.
│ For a copy, see https://opensource.org/licenses/MIT
│ or the LICENSE file in the root of this project.
└ */
type ControlKey = /* Buttons */
"play" | "pause" | "playpause" | "backward10" | "forward10" | "previous" | "next" | "mute" | "fullscreen" | "pictureinpicture" | "shuffle" | "repeat" | "airplay" | "playlist" | "seekbar" | "time" | "duration" | "remaining" | "title" | "artist" | "album" | "metadata" | "loading" | "stalled" | "error" | "spacer" | "empty";
/**
 * The props the custom control receives.
 */
type CustomControlProps = {
    [key: string]: unknown;
};
/**
 * A control is either a key of the ControlKey type or a React component that accepts CustomControlProps.
 */
type GenericControlType = ControlKey | React.ComponentType<CustomControlProps>;
/**
 * A controls-group is an array of controls (either keys or components).
 */
type ControlsGroupType = GenericControlType[];
/**
 * A controls-row is an array of controls (either keys or components) or control-groups.
 * This allows nesting controls in a grid-like structure.
 */
type ControlsRowType = (GenericControlType | ControlsGroupType)[];
/**
 * A controls-grid is an array of controls-rows or a single controls-row.
 * Again, this allows nesting controls in a grid-like structure.
 */
type ControlsGridType = ControlsRowType[] | ControlsRowType;
/**
 * Map of textually defined button sizes to their numeric values (in `rem` for TailwindCSS)
 */
declare const buttonSizes: {
    readonly xs: 2;
    readonly sm: 4;
    readonly md: 6;
    readonly lg: 8;
    readonly xl: 10;
};
type WithLabel = {
    /**
     * The label to display on the button
     */
    label: string;
    /**
     * If we have a label, we can't have an icon
     */
    icon?: never;
};
type WithIcon = {
    /**
     * The icon to display on the button.
     * If it's a string, it's assumed to be the content of an SVG file;
     * this will be parsed to extract paths and viewbox and then rendered as a React component.
     * If it's a React node, it's assumed to be a React component that will be rendered as-is.
     */
    icon: string | React.ReactNode;
    /**
     * If we have an icon, we can't have a label
     */
    label?: never;
};
type BaseButtonProps = (WithLabel | WithIcon) & {
    /**
     * The key of the control, used to determine if there's a theme color to use for this particular button.
     */
    controlKey?: ControlKey;
    /**
     * The size of the icon. Defaults to `md`.
     */
    size?: keyof typeof buttonSizes;
    /**
     * Whether the button is currently loading. If `true`, a spinner will be displayed instead of the button content.
     * Defaults to `false`.
     */
    loading?: boolean;
    /**
     * Whether the button is currently in error state. If `true`, an error icon will be displayed instead of the button.
     * Defaults to `false`.
     */
    error?: boolean;
    /**
     * Whether the button is currently active. If `false`, the button will be rendered with a 50% opacity.
     * It's useful for `toggle` buttons to show if the action the button performs is currently active or not.
     * Defaults to `true`.
     */
    active?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
declare const _default: React.MemoExoticComponent<React.ForwardRefExoticComponent<BaseButtonProps & React.RefAttributes<HTMLButtonElement>>>;
/* ┐
│ File: aspect-ratio.ts [/src/media/utils/aspect-ratio.ts]
│ Package: @rs1/media-player | RS1 Project
│ Author: Andrea Corsini
│ Created: April 25th, 2023 - 11:40:05
│ Modified: April 27th, 2023 - 10:35:00
│
│ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
│ This work is licensed under the terms of the MIT License.
│ For a copy, see https://opensource.org/licenses/MIT
│ or the LICENSE file in the root of this project.
└ */
declare const aspectRatios: readonly [
    "1:1",
    "2:1",
    "1:2",
    "3:1",
    "1:3",
    "2:3",
    "3:2",
    "4:3",
    "3:4",
    "16:9",
    "9:16",
    "21:9",
    "9:21"
];
type AspectRatio = (typeof aspectRatios)[number] | "auto" | "stretch";
type MediaType = "audio" | "video";
/**
 * Defines a new type that depends on media types.
 * Given a type `T`, it returns a type that allows either `T` directly
 * or an array of tuples of the form `[MediaType, T]`.
 */
type WithMediaType<T> = T | [
    MediaType,
    T
][];
/**
 * Defines a new type that depends on breakpoints.
 * Given a type `T`, it returns a type that allows either `T` directly
 * or a map of the form `{ [Breakpoint]: T }`.
 */
type WithBreakpoint<T> = T | {
    [K in Breakpoint]?: T;
};
/**
 * The configuration object for the media player.
 * This object needs to be passed to the `MediaProvider` component via the `config` prop.
 * It will then be available to all the children components via the `useMediaConfig` hook.
 */
interface MediaConfig {
    /**
     * The aspect ratio of the player.
     *
     * **Note:** Only `auto` and `stretch` are valid aspect ratios if the player mode is not `video`.
     * ```js
     * // It can be a specific ratio:
     * const squareRatio = '1:1'
     * const doubleSquareRatio = '2:1'
     * const halfSquareRatio = '1:2'
     * const tripleSquareRatio = '3:1'
     * const thirdSquareRatio = '1:3'
     * const doubleThirdRatio = '2:3'
     * const tripleDoubleRatio = '3:2'
     * const fourThirdRatio = '4:3'
     * const thirdFourRatio = '3:4'
     * const wideRatio = '16:9'
     * const tallRatio = '9:16'
     * const wideCinemaRatio = '21:9'
     * const tallCinemaRatio = '9:21'
     *
     * // It can be `auto` (the intrinsic aspect ratio of the video):
     * const autoRatio = 'auto'
     *
     * // It can be `stretch` (the player will stretch to fill the container):
     * const stretchRatio = 'stretch'
     * ```
     * @default 'auto'
     */
    aspectRatio: AspectRatio;
    /**
     * The display mode of the player.\
     * It can be specified for each media type by using an array of tuples. (Format: `[[mediaType1, mode1], [mediaType2, mode2]]`)
     * It can be specified for each breakpoint by using a map. (Format: `{ [breakpoint1]: mode1, [breakpoint2]: mode2 }` or `{ [breakpoint1]: [[mediaType1, mode1], [mediaType2, mode2]] }`)
     *
     * Supported modes:
     * - `auto`: the player will choose the best mode based on the media type and the device (`video` for video, `artwork` for audio) (default)
     * - `video`: the player will display as a video player
     * - `artwork`: the player will display as an artwork player (similar to Spotify, Apple Music, etc. - shows the artwork and the controls)
     * - `vinyl`: the player will display as a vinyl player (shows the artwork as a spinning vinyl and the controls)
     * - `controls`: the player will display as a controls-only player (shows only the controls)
     * - `artwork-mini`: the player will display as a mini artwork player (similar to Spotify, Apple Music, etc. - shows the artwork and the controls)
     * - `vinyl-mini`: the player will display as a mini vinyl player (shows the artwork as a spinning vinyl and the controls)
     * ```js
     * // It can be a string (the same mode for all media types and breakpoints).
     * // Format: `mode`
     * // This will use the `artwork` mode for all media types and breakpoints.
     * const playerMode = 'artwork'
     *
     * // It can be an array of tuples (a different mode for each media type).
     * // Format: `[[mediaType1, mode1], [mediaType2, mode2]]`
     * // This will use the `artwork` mode for audio and the `video` mode for video (for all breakpoints).
     * const playerMode = [['audio', 'artwork'], ['video', 'video']]
     *
     * // It can be a map of strings (a different mode for each breakpoint).
     * // Format: `{ [breakpointName]: mode }`
     * // This will use the `artwork-mini` mode for the `xs` breakpoint and the `artwork` mode for the `md` breakpoint (for all media types).
     * const playerMode = { xs: 'artwork-mini', md: 'artwork' }
     *
     * // It can be a map of arrays of tuples (a different mode for each media type and breakpoint).
     * // Format: `{ [breakpointName]: [[mediaType1, mode1], [mediaType2, mode2]] }`
     * // This will use the `artwork-mini` mode for audio and the `video` mode for video for the `xs` breakpoint and the `artwork` mode for audio and the `video` mode for video for the `md` breakpoint.
     * const playerMode = { xs: [['audio', 'artwork-mini'], ['video', 'video']], md: [['audio', 'artwork'], ['video', 'video']] }
     * ```
     * @default 'auto'
     */
    playerMode: WithBreakpoint<WithMediaType<"auto" | "video" | "artwork" | "vinyl" | "controls" | "artwork-mini" | "vinyl-mini">>;
    /**
     * The background of the player.\
     * It can be specified for each breakpoint by using a map. (Format: `{ [breakpoint1]: bg1, [breakpoint2]: bg1 }`)
     *
     * Supported backgrounds:
     * - `none`: no background (default)
     * - `flat`: a flat background
     * - `blur`: a blurred background (the player will use the artwork blurred as background)
     *
     * **Note:** this has no effect if the player mode is `video`.
     * ```
     * // A flat background for all breakpoints:
     * const playerBackground = 'flat'
     *
     * // A flat background for the `xs` breakpoint and a blurred background for the `md` breakpoint:
     * const playerBackground = { xs: 'flat', md: 'blur' }
     * ```
     * @default 'none'
     */
    playerBackground: WithBreakpoint<"none" | "flat" | "blur">;
    /**
     * A map of breakpoints to use for the player.\
     * The map is in the form of `{ [breakpointName]: minWindowWith }`.\
     * The breakpoints will be used to determine the player mode and the controls grid type
     * based on the width of the window.
     * ```js
     * // The default breakpoints:
     * const breakpoints = {
     *    xs: 0,
     *    sm: 576,
     *    md: 768,
     *    lg: 992,
     *    xl: 1200,
     * }
     * ```
     */
    breakpoints: CustomBreakpoints;
    /**
     * Wether to automatically hide the controls after a certain amount of time.
     *
     * **Note:** this has no effect if the player mode is not `video`.
     * ```
     * // The controls will always be visible:
     * const autoHideControls = false
     *
     * // The controls will be hidden after 3 seconds:
     * const autoHideControls = true
     *
     * // The controls will be hidden after `n` milliseconds:
     * const autoHideControls = 3000 // `n` milliseconds
     * ```
     * @default 3000
     */
    autoHideControls: number | boolean;
    /**
     * The list of controls to show. The controls will be organized in rows and groups based on the provided array.\
     * Controls can be represented either as a string (the name of the control) or as a React component.\
     * Nesting arrays will create groups and rows.\
     * It can be specified for each breakpoint by using a map. (Format: `{ [breakpoint1]: controls1, [breakpoint2]: controls2 }`)
     * ```js
     * // 3 rows of controls
     * const controls = [
     *    'playpause',
     *    ['time', 'seekbar', 'remaining'],
     *    [
     *       ['mute', 'airplay'],
     *       ['pictureinpicture', 'fullscreen']
     *    ]
     * ]
     * // The first row will contain the `playpause` control (same as `['playpause']`).
     * // A single control will be centered:
     * |----------[playpause]---------|
     *
     * // The second row will contain the `time`, `seekbar`, and `remaining` controls.
     * // Multiple controls in rows are spaced evenly:
     * |[time]--[seekbar]--[remaining]|
     *
     * // The third row will contain 2 groups: the first group will contain the `mute` and `airplay` controls,
     * // the second group will contain the `pictureinpicture` and `fullscreen` controls.
     * // Multiple groups in rows are spaced evenly between them, and the controls inside the groups
     * // are aligned left for the first group, right for the last group, and centered for the others:
     * ||[mute]--[airplay]----||----[pictureinpicture]--[fullscreen]||
     *
     * // The final grid will look like this:
     * |----------------------------------[    playpause   ]----------------------------------|
     * |[      time      ]----------------[     seekbar    ]----------------[   remaining    ]|
     * ||[     mute      ]--[   airplay   ]-------||----[pictureinpicture]--[    fullscreen ]||
     * ```
     *
     * For the list of available controls, see the `ControlKey` type or `src/bits/controls`.\
     * All predefined controls can be included importing the `controls` map.
     * ```js
     * import { controls } from '@rs1/media-player'
     * ```
     * For the default controls grid, see `src/media/factories/media-config.ts`.
     *
     * @default
     * ```js
     * const controls = [
     *    [
     *       ['playlist', 'shuffle', 'error'],
     *       ['previous', 'backward10', 'playpause', 'forward10', 'next'],
     *       ['stalled', 'repeat']
     *    ],
     *    ['time', 'seekbar', 'remaining'],
     *    [
     *       ['mute', 'airplay'],
     *       'metadata',
     *       ['pictureinpicture', 'fullscreen']
     *    ],
     * ]
     * ```
     */
    controls: WithBreakpoint<ControlsGridType | false>;
    /**
     * The separator to use between the metadata items in the metadata control.
     * ```
     * // The metadata items will be separated by a dot:
     * const controlsMetadataSeparator = ' . '
     *
     * // The metadata items will be separated by a dash:
     * const controlsMetadataSeparator = ' - '
     * ```
     * @default ' — '
     */
    controlsMetadataSeparator: string;
    /**
     * Whether the media should start playing automatically.
     *
     * **Note:** on some browsers, autoplay is disabled by default and can only be enabled if the media is also muted.
     * ```
     * // The media will start playing automatically:
     * const autoPlay = true
     *
     * // The media will not start playing automatically:
     * const autoPlay = false
     * ```
     * @default false
     */
    autoPlay: boolean;
    /**
     * Whether the media should restart automatically the same video/track when it ends.
     * ```
     * // The video/track will restart automatically when it ends:
     * const autoRestart = true
     *
     * // The video/track will not restart automatically when it ends:
     * // (It will go to the next video/track in the playlist if there is one)
     * const autoRestart = false
     * ```
     * @default false
     */
    loop: boolean;
    /**
     * Whether the media should start playing as muted.
     *
     * **Notes:**
     * - use in combination with `autoPlay` to make sure the media will start playing automatically;
     * - use in combination with `canMute` if you don't want the user to be able to unmute the media.
     * ```
     * // The media will start playing as muted:
     * const muted = true
     *
     * // The media will not start playing as muted:
     * const muted = false
     * ```
     * @default false
     */
    muted: boolean;
    /**
     * Whether the player should respond to keyboard events.
     *
     * The single key events can be disabled individually via the `can*` props.
     *
     * **Supported keyboard events:**
     * - ` ` (Space): toggle play/pause;
     *   - (can be disabled via `canPause`)
     * - `←` (ArrowLeft): seek backward 10 seconds;
     *   - (can be disabled via `canSeek`)
     * - `→` (ArrowRight): seek forward 10 seconds;
     *   - (can be disabled via `canSeek`)
     * - `↑` (ArrowUp): increase volume by 5%;
     *   - (can be disabled via `canChangeVolume`)
     * - `↓` (ArrowDown): decrease volume by 5%;
     *   - (can be disabled via `canChangeVolume`)
     * - `m` (KeyM): toggle mute/unmute;
     *   - (can be disabled via `canMute`)
     * - `f` (KeyF): toggle fullscreen;
     *   - (can be disabled via `canFullscreen`)
     * - `p` (KeyP): toggle picture-in-picture;
     *   - (can be disabled via `canPictureInPicture`)
     * - `r` (KeyR): toggle repeat-all/repeat-one;
     *   - (can be disabled via `canLoop`)
     * - `l` (KeyL): toggle repeat-all/repeat-one;
     *   - (can be disabled via `canLoop`)
     * - `s` (KeyS): toggle shuffle;
     *   - (can be disabled via `canShuffle`)
     * ```
     * // The player will respond to keyboard events:
     * const keyboardControls = true
     *
     * // The player will not respond to keyboard events:
     * const keyboardControls = false
     * ```
     * @default true
     */
    canControlWithKeyboard: boolean;
    /**
     * Whether the playlist can be shuffled via the UI/keyboard.
     * @default true
     */
    canShuffle: boolean;
    /**
     * Whether the current video/track can be looped via the UI/keyboard.
     * (Loop means that the current video/track will be played again when it ends.)
     * @default true
     */
    canLoop: boolean;
    /**
     * Whether the player can be paused via the UI/keyboard.
     * @default true
     */
    canPause: boolean;
    /**
     * Whether the player can seek to a specific time via the UI/keyboard.
     * @default true
     */
    canSeek: boolean;
    /**
     * Whether the player can be muted via the UI/keyboard.
     * @default true
     */
    canMute: boolean;
    /**
     * Whether the player volume can be changed via the UI/keyboard.
     * @default true
     */
    canChangeVolume: boolean;
    /**
     * Whether the player playback rate can be changed via the UI/keyboard.
     * @default true
     */
    canChangePlaybackRate: boolean;
    /**
     * Whether the player can enter/exit fullscreen via the UI/keyboard.
     * @default true
     */
    canFullscreen: boolean;
    /**
     * Whether the player can enter/exit picture-in-picture via the UI/keyboard.
     * @default true
     */
    canPictureInPicture: boolean;
    /**
     * Whether the player can stream to AirPlay via the UI/keyboard.
     * @default true
     */
    canAirPlay: boolean;
    /**
     * Whether the user should be able to tap/click on the player to toggle play/pause.
     * - For `vinyl`/`artwork` mode this means tapping on the artwork.
     * - For `video` mode this means tapping on the video.
     * This has no effect if `canPause` is `false`, or if the player mode is `controls`.
     * @default true
     */
    canTapToPause: boolean;
    /**
     * Whether the user should be able to double tap/click on the player to seek.
     * (Double tap on the left side of the player to seek backward 10 seconds, double tap on the right side to seek forward 10 seconds.)
     * - For `vinyl`/`artwork` mode this means double tapping on the artwork.
     * - For `video` mode this means double tapping on the video.
     * This has no effect if `canSeek` is `false`, or if the player mode is `controls`, `artwork-mini`, or `vinyl-mini`.
     * @default true
     */
    canDoubleTapToSeek: boolean;
}
/**
 * A collection of functions to control the media.
 * These functions are available to all the `MediaProvider` children via the `useMediaControls` hook.
 */
interface MediaControls {
    /**
     * Starts playing the media.
     */
    play: () => void;
    /**
     * Pauses the media.
     */
    pause: () => void;
    /**
     * Toggles play/pause.
     * (If the media is playing it will be paused, if the media is paused it will be played.)
     */
    togglePlay: () => void;
    /**
     * Seeks to a specific time in seconds.
     * @param {number} time - The time to seek to.
     * Time must be a number between `0` and `duration`.
     * @example
     * ```
     * const { seek } = useMediaControls()
     *
     * // Seek to time 1:23
     * seek(83)
     * ```
     */
    seek: (time: number) => void;
    /**
     * Skips `offset` seconds forward/backward from the current time.
     * @param {number} offset - The offset to skip.
     * @example
     * ```
     * const { skip } = useMediaControls()
     *
     * // Skip 10 seconds forward
     * skip(10)
     *
     * // Skip 10 seconds backward
     * skip(-10)
     * ```
     */
    skip: (offset: number) => void;
    /**
     * Skips to the next video/track in the playlist.
     * If the current video/track is the last one in the playlist, it will skip to the first video/track.
     * @example
     * ```
     * const { next } = useMediaControls()
     * next()
     * ```
     */
    next: () => void;
    /**
     * Skips to the previous video/track in the playlist.
     * If the current video/track is the first one in the playlist, it will skip to the last video/track.
     * @example
     * ```
     * const { previous } = useMediaControls()
     * previous()
     * ```
     */
    previous: () => void;
    /**
     * Mutes the media.
     * @example
     * ```
     * const { mute } = useMediaControls()
     * mute()
     * ```
     */
    mute: () => void;
    /**
     * Unmutes the media.
     * @example
     * ```
     * const { unmute } = useMediaControls()
     * unmute()
     * ```
     */
    unmute: () => void;
    /**
     * Toggles the media mute state.
     * (If the media is muted it will be unmuted, if the media is unmuted it will be muted.)
     * @example
     * ```
     * const { toggleMute } = useMediaControls()
     * toggleMute()
     * ```
     */
    toggleMute: () => void;
    /**
     * Pushes the player into fullscreen mode.
     * @example
     * ```
     * const { enterFullscreen } = useMediaControls()
     * enterFullscreen()
     * ```
     */
    enterFullscreen: () => void;
    /**
     * Exits fullscreen mode.
     * @example
     * ```
     * const { exitFullscreen } = useMediaControls()
     * exitFullscreen()
     * ```
     */
    exitFullscreen: () => void;
    /**
     * Toggles fullscreen mode.
     * (If the player is in fullscreen mode it will exit fullscreen mode, if the player is not in fullscreen mode it will enter fullscreen mode.)
     * @example
     * ```
     * const { toggleFullscreen } = useMediaControls()
     * toggleFullscreen()
     * ```
     */
    toggleFullscreen: () => void;
    /**
     * Pushes the player into picture-in-picture mode.
     * It works only if the browser supports picture-in-picture and a video is playing.
     * @example
     * ```
     * const { enterPiP } = useMediaControls()
     * enterPiP()
     * ```
     */
    enterPiP: () => void;
    /**
     * Exits picture-in-picture mode.
     * @example
     * ```
     * const { exitPiP } = useMediaControls()
     * exitPiP()
     * ```
     */
    exitPiP: () => void;
    /**
     * Toggles picture-in-picture mode.
     * It works only if the browser supports picture-in-picture and a video is playing.
     * (If the player is in picture-in-picture mode it will exit picture-in-picture mode, if the player is not in picture-in-picture mode it will enter picture-in-picture mode.)
     * @example
     * ```
     * const { togglePiP } = useMediaControls()
     * togglePiP()
     * ```
     */
    togglePiP: () => void;
    /**
     * Seeks to a specific time expressed in percentage [0-1]. (`progress = time / duration`)
     * @param {number | ((progress: number) => number)} progress - The progress to seek to.
     * It can either be:
     * - a number between `0` and `1`,
     * - a function that receives the current progress and returns a new progress.
     * @example
     * ```
     * const { setProgress } = useMediaControls()
     *
     * // Seek halfway through the video/track
     * setProgress(0.5)
     *
     * // Seek forward of 10%
     * setProgress(progress => progress + 0.1)
     * ```
     */
    setProgress: (progress: number | ((progress: number) => number)) => void;
    /**
     * Sets the volume of the media player.
     * @param {number | ((volume: number) => number)} volume - The volume to set.
     * It can either be:
     * - a number between `0` and `1` (where `0` is muted and `1` is max volume),
     * - a function that receives the current volume and returns a new volume.
     * @example
     * ```
     * const { setVolume } = useMediaControls()
     *
     * // Set the volume to 50%
     * setVolume(0.5)
     *
     * // Increase the volume by 10%
     * setVolume(volume => volume + 0.1)
     * ```
     */
    setVolume: (volume: number | ((volume: number) => number)) => void;
    /**
     * Sets the playback rate of the media player.
     * @param {MediaPlaybackRate | ((playbackRate: MediaPlaybackRate) => MediaPlaybackRate)} playbackRate - The playback rate to set.
     * It can either be:
     * - a number between 0.25 and 2 (where 1 is the normal playback rate)
     * - - *[this should be one of 0.25, 0.5, 0.75, **1**, 1.25, 1.5, 2]*
     * - a function that receives the current playback rate and returns a new playback rate.
     * @example
     * ```
     * const { setPlaybackRate } = useMediaControls()
     *
     * // Slow down the playback rate to 0.5x
     * setPlaybackRate(0.5)
     *
     * // Increase the playback rate by 0.25x
     * setPlaybackRate(playbackRate => playbackRate + 0.25)
     * ```
     * @see MediaPlaybackRate
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate
     */
    setPlaybackRate: (playbackRate: MediaPlaybackRate | ((playbackRate: MediaPlaybackRate) => MediaPlaybackRate)) => void;
}
/**
 * A TypeScript representation of a CSS color.
 * Supports:
 * - hex colors (`#000000`, `#000`, `#00000000`, `#0000`),
 * - rgb colors (`rgb(0, 0, 0)`),
 * - rgba colors (`rgba(0, 0, 0, 0)`),
 * - hsl colors (`hsl(0, 0%, 0%)`),
 * - hsla colors (`hsla(0, 0%, 0%, 0)`),
 * - keywords (`transparent`, `currentcolor`, `inherit`).
 */
type Color = `#${string}` | `rgb(${number}, ${number}, ${number})` | `rgba(${number}, ${number}, ${number}, ${number})` | `hsl(${number}, ${number}%, ${number}%)` | `hsla(${number}, ${number}%, ${number}%, ${number})` | "transparent" | "currentcolor" | "inherit";
/**
 * The theme object for the media player.
 * This object needs to be passed to the `MediaProvider` component via the `theme` prop.
 * It will then be available to all the children components via the `useMediaTheme` hook.
 *
 * See `./src/media/factories/media-theme.ts` for the default themes.
 */
interface MediaTheme extends Partial<Record<ControlKey | keyof MediaTrack, Color>> {
    /**
     * The foreground color of the controls.
     * This means for example the color of the play/pause button, the seek bar, etc.
     *
     * **Example:** `#EEEEEE`
     */
    controlsColor: Color;
    /**
     * The background color of the controls.
     * When the player is in `video` mode, this (faded and blurred) will be the color of the controls bar.
     * When the player is in `artwork`, `vinyl`, or `controls` mode:
     * - if the `playerBackground` is set to `none`, this will have no effect,
     * - if the `playerBackground` is set to `flat` or `blur`, this will be the background of the player.
     *
     * **Example:** `#000000`
     */
    controlsBg: Color;
    /**
     * The color of the controls when hovered.
     * This means for example the color of the play/pause button when hovered.
     *
     * **Example:** `#FFFFFF`
     */
    accentColor: Color;
    /**
     * The color to use for the error message and the error icon.
     * (When the media player fails to load a media track)
     *
     * **Example:** `#FF0000`
     */
    errorColor: Color;
    /**
     * The background color of the playing media.
     * This will have different effects depending on the mode of the player:
     * - `video`: this will be the background of the player.
     * - `artwork`: this will be the background of the artwork (only visible if the artwork has transparent parts).
     * - all others: this will have no effect.
     *
     * **Example:** `#000000`
     */
    mediaBg: Color;
    /**
     * The font family to use for the media player.
     *
     * **Example:** `"Arial", sans-serif`
     */
    textFont: string;
    /**
     * The font family to use for the mono-spaced text in the media player.
     * (For example the time in the seek bar)
     *
     * **Example:** `"Courier New", monospace`
     */
    monoFont: string;
}
/**
 * @typedef {Object} MediaTrack - A representation of a media track.
 */
interface MediaTrack {
    /**
     * The source(s) of the media track.\
     * If multiple sources are provided, the first one that is supported by the browser will be used.
     */
    src: string[];
    /**
     * The type of the media track, either `audio` or `video`.
     */
    type: MediaType;
    /**
     * The MIME type of the media track.\
     * If multiple sources are provided, this should be an array of MIME types.\
     * If not provided, the MIME type will be inferred from the source(s) extension(s).
     */
    mimeType: string[];
    /**
     * The unique ID of the media track.\
     * Useful for identifying the track in the playlist or setting the active track later on.
     */
    id: string | number;
    /**
     * The index of the media track in the playlist.
     */
    index: number;
    /**
     * The title of the media track.
     */
    title?: string;
    /**
     * The artist of the media track.
     */
    artist?: string;
    /**
     * The album of the media track.
     */
    album?: string;
    /**
     * An URL to the cover of the media track.\
     * It will be used as the cover of the track in the `artwork`/`vinyl` mode.
     */
    cover?: string;
    /**
     * An URL to the artwork of the media track.\
     * It will be used in the MediaSession API (Native media controls).\
     * It will serve as a fallback cover for the `artwork`/`vinyl` mode.
     */
    artwork?: string;
    /**
     * An URL to the poster of the media track.\
     * It will be used as the poster of the media player.\
     * It will serve as a fallback artwork for the MediaSession API.
     */
    poster?: string;
    /**
     * Optionally, a string representing the track side.\
     * Useful for dual-sided vinyls. (A/B)
     */
    side?: string;
    /**
     * Optionally, a string or number representing the track position.\
     * Useful for tracklists. (1, 2, 3, ...)
     */
    position?: string | number;
    /**
     * If the track request should include CORS headers, set this to `anonymous` or `use-credentials`.\
     * If not provided, the track will be requested without CORS headers.
     */
    crossOrigin?: "anonymous" | "use-credentials";
}
type RawMediaTrack = Omit<MediaTrack, "type" | "src" | "mimeType" | "id" | "index" | "crossOrigin"> & {
    src: string | string[];
    mimeType?: string | string[];
    id?: string | number;
    type?: MediaType;
    crossOrigin?: "anonymous" | "use-credentials" | "" | boolean;
};
/**
 * @typedef {Object} MediaPlaylist - A representation of a media playlist.
 */
interface MediaPlaylist {
    /**
     * The unique ID of the playlist.
     */
    id: string;
    /**
     * The title of the playlist.
     */
    title?: string;
    /**
     * The artist of the playlist.
     */
    artist?: string;
    /**
     * The album of the playlist.
     */
    album?: string;
    /**
     * An URL to the artwork of the playlist.
     */
    artwork?: string;
    /**
     * An array of media tracks in the playlist.
     */
    tracks: MediaTrack[];
}
type RawMediaPlaylist = Omit<MediaPlaylist, "id" | "tracks"> & {
    id?: string;
    tracks: RawMediaTrack[];
};
/**
 * A collection of functions to control the playlist.
 * These functions are available to all the `MediaProvider` children via the `usePlaylistControls` hook.
 */
interface PlaylistControls {
    /**
     * Activates the loop state for the current track.
     * @example
     * ```js
     * const { loop } = usePlaylistControls()
     * loop()
     * ```
     */
    loop: () => void;
    /**
     * Deactivates the loop state for the current track.
     * @example
     * ```js
     * const { unloop } = usePlaylistControls()
     * unloop()
     * ```
     */
    unloop: () => void;
    /**
     * Toggles the loop state of the current track.
     * If the track is looped, it will be unlooped.
     * If the track is unlooped, it will be looped.
     * @example
     * ```js
     * const { toggleLoop } = usePlaylistControls()
     * toggleLoop()
     * ```
     */
    toggleLoop: () => void;
    /**
     * Shuffles the current playlist.
     * @example
     * ```js
     * const { shuffle } = usePlaylistControls()
     * shuffle()
     * ```
     */
    shuffle: () => void;
    /**
     * Unshuffles the current playlist.
     * @example
     * ```js
     * const { unshuffle } = usePlaylistControls()
     * unshuffle()
     * ```
     */
    unshuffle: () => void;
    /**
     * Toggles the shuffle state of the current playlist.
     * If the playlist is shuffled, it will be unshuffled.
     * If the playlist is unshuffled, it will be shuffled.
     * @example
     * ```
     * const { toggleShuffle } = usePlaylistControls()
     * toggleShuffle()
     * ```
     */
    toggleShuffle: () => void;
    /**
     * Sets the active track.
     * @param {RawMediaTrack | string | number | null} track - The track to set as active.
     * `track` can be one of the following:
     * - a `MediaTrack` object, it will be used as the active track.
     * - - `MediaTrack` objects are compared based on the `id` property.
     * - - The track will be added to the playlist if it's not already in it.
     * - a `string`, it will be used as the ID of the track in the playlist.
     * - a `number`, it will be used as the index of the track in the playlist.
     * - `null`, the active track will be unset.
     * @example
     * ```js
     * const { setTrack } = usePlaylistControls()
     *
     * // Set the first track in the playlist as active
     * setTrack(0)
     *
     * // Set the track with the ID "my-track" as active
     * setTrack("my-track")
     *
     * const track = {
     *  src: "https://example.com/my-audio.mp3",
     *  id: "my-audio-track"
     * }
     * // Set `track` as active
     * setTrack(track)
     *
     * // Unset the active track
     * setTrack(null)
     * ```
     */
    setTrack: (track: RawMediaTrack | string | number | null) => void;
    /**
     * Skips the active track by the specified offset. (Negative values are allowed)
     * @param {number} offset - The offset to skip the track by.
     * If the offset is greater than the playlist length, the track will be skipped to the end.
     * If the offset is lower than the negative playlist length, the track will be skipped to the start.
     * @example
     * ```js
     * const { skipTrackBy } = usePlaylistControls()
     *
     * // Go to the next track
     * skipTrackBy(1)
     *
     * // Go to the previous track
     * skipTrackBy(-1)
     *
     * // Considering a playlist with 10 tracks
     * // and the active track being the 2nd track
     * // ...
     *
     * // to reach the 5th track
     * skipTrackBy(3)
     *
     * // to reach the 1st track
     * skipTrackBy(-1)
     *
     * // this would still go to the 1st track
     * // because the offset is lower than the negative playlist length
     * skipTrackBy(-100)
     *
     * // this would still go to the 10th track
     * skipTrackBy(100)
     * ```
     */
    skipTrackBy: (offset: number) => void;
    /**
     * Skip to the previous track in the playlist.
     * If the active track is the first track in the playlist, the last track will be selected.
     * @example
     * ```js
     * const { previousTrack } = usePlaylistControls()
     * previousTrack()
     *
     * // This is equivalent to
     * const { skipTrackBy } = usePlaylistControls()
     * skipTrackBy(-1)
     * ```
     */
    previousTrack: () => void;
    /**
     * Skip to the next track in the playlist.
     * If the active track is the last track in the playlist, the first track will be selected.
     * @example
     * ```js
     * const { nextTrack } = usePlaylistControls()
     * nextTrack()
     *
     * // This is equivalent to
     * const { skipTrackBy } = usePlaylistControls()
     * skipTrackBy(1)
     * ```
     */
    nextTrack: () => void;
}
/**
 * @typedef {Object} PlaylistState - holds the state of the playlist
 */
interface PlaylistState {
    /**
     * Whether the playlist is currently shuffled.
     */
    shuffle: boolean;
    /**
     * The repeat mode of the playlist.
     * - `repeat` - The playlist will be repeated.
     * (1 -> 2 -> 3 -> 1 -> 2 -> 3 -> ...) — *default*
     * - `repeat-one` - The active track will be repeated.
     * (1 -> 1 -> 1 -> 1 -> ...)
     */
    mode: "repeat" | "repeat-one";
}
/**
 * Media intrinsic size in pixels.
 */
type MediaSize = readonly [
    number,
    number
];
/**
 * Media playback rate as float between 0.25 and 2 in steps of 0.25.
 */
type MediaPlaybackRate = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;
/**
 * @typedef {Object} MediaState - holds the state of the media player
 */
interface MediaState {
    /**
     * Whether the media was playing before the last pause.
     * This is used to restore the playback state after an interruption-caused pause.
     * E.g. when the `MediaTrack` changes or the user exits fullscreen/PiP.
     * @private
     * @default false
     */
    wasPlaying: boolean;
    /**
     * Whether the media is currently playing.
     * @default false
     */
    isPlaying: boolean;
    /**
     * Whether the media is currently waiting for data to be loaded.
     * @default false
     */
    isWaiting: boolean;
    /**
     * Whether the media is currently stalled. (is waiting for data but the data is not coming)
     * @default false
     */
    isStalled: boolean;
    /**
     * Whether the media is currently seeking, and if so, in which direction.
     * @default false
     */
    isSeeking: "forward" | "backward" | false;
    /**
     * Whether the media is currently loaded and ready to play.
     * @default false
     */
    isLoaded: boolean;
    /**
     * Whether the media is currently muted.
     * @default false
     */
    isMuted: boolean;
    /**
     * Whether the media is currently in fullscreen mode.
     * @default false
     */
    isFullscreen: boolean;
    /**
     * Whether the media is currently in Picture-in-Picture mode.
     * @default false
     */
    isPictureInPicture: boolean;
    /**
     * Whether the media is currently in AirPlay mode.
     * @default false
     */
    isAirPlay: boolean;
    /**
     * Whether the media has encountered an error, and if so, the error message.
     * @default false
     */
    hasError: string | false;
    /**
     * Whether the media has loaded data.
     * @default false
     */
    hasLoadedData: boolean;
    /**
     * Whether the media has loaded at least the metadata.
     * Metadata includes the duration, the intrinsic size, etc.
     * @default false
     */
    hasLoadedMetadata: boolean;
    /**
     * The current volume as a float between 0 and 1.
     * @default 1
     */
    volume: number;
    /**
     * The current playback rate as a float between 0.25 and 2 in steps of 0.25.
     * @see MediaPlaybackRate
     * @default 1
     */
    playbackRate: MediaPlaybackRate;
    /**
     * The intrinsic size of the media in pixels.
     * @see MediaSize
     * @default [0, 0]
     */
    intrinsicSize: MediaSize;
}
/**
 * @typedef {Object} MediaTimeState - Holds the current time, duration, progress and buffer of the media.
 */
interface MediaTimeState {
    /**
     * The current playback time in seconds.
     * @default 0
     */
    time: number;
    /**
     * The total duration of the media in seconds.
     * @default 0
     */
    duration: number;
    /**
     * The current playback progress as a float between 0 and 1.
     * This is calculated as `time / duration`.
     * @default 0
     */
    progress: number;
    /**
     * The current buffered time as a float between 0 and 1.
     * This is calculated as `buffered / duration`.
     * @default 0
     */
    buffered: number;
}
type BaseTextProps = {
    /**
     * The text to display.
     */
    text?: string;
    /**
     * A map of text to display for each property of the track.
     * @example { artist: 'Artist', title: 'Title' }
     * Knowing what property corresponds to what text allows
     * the user to customize the styling of each property, via the theme or CSS.
     * Each property will be wrapped in a span with the id `${id}-${property}`,
     * and will be separated from the next property by a span with the id `${id}-${property}-separator`
     * with a content of either the `separator` prop or the `controlsMetadataSeparator` from the config.
     */
    textMap?: Partial<Record<keyof MediaTrack, string>>;
    /**
     * The separator to use between properties.
     * If not specified, the `controlsMetadataSeparator` from the config will be used.
     * If that is not specified either, a dash will be used.
     */
    separator?: string;
} & React.HTMLAttributes<HTMLSpanElement>;
declare const _default: React.MemoExoticComponent<React.ForwardRefExoticComponent<{
    text?: string | undefined;
    textMap?: Partial<Record<keyof MediaTrack, string>> | undefined;
    separator?: string | undefined;
} & React.HTMLAttributes<HTMLSpanElement> & React.RefAttributes<HTMLSpanElement>>>;
type BaseTimeProps = {
    type?: "time" | "duration" | "remaining";
} & React.HTMLAttributes<HTMLSpanElement>;
declare const _default: React.MemoExoticComponent<React.ForwardRefExoticComponent<{
    type?: "time" | "duration" | "remaining" | undefined;
} & React.HTMLAttributes<HTMLSpanElement> & React.RefAttributes<HTMLSpanElement>>>;
declare namespace controls {
    /**
     * A button that shows the AirPlay picker.\
     * Note: this button works only on Safari. It won't be rendered on other browsers.
     */
    function AirPlay(): JSX.Element | null;
    /**
     * A text label showing the current track's album.\
     * Won't be rendered if the track has no album.
     */
    function Album(): JSX.Element;
    /**
     * A text label showing the current track's artist.\
     * Won't be rendered if the track has no artist.
     */
    function Artist(): JSX.Element;
    /**
     * A button that skips backward 10 seconds.\
     * Won't be rendered if the media can't be seeked.
     */
    function Backward10(): JSX.Element | null;
    /**
     * A text label showing the current track's duration.\
     * Will be rendered as `--:--` if the track is not loaded.
     */
    function Duration(): JSX.Element;
    /**
     * An icon that shows when an error occurs while loading the media.\
     * Will render an empty div if there's no error.
     */
    function Error(): JSX.Element;
    /**
     * A button that skips forward 10 seconds.\
     * Won't be rendered if the media can't be seeked.
     */
    function Forward10(): JSX.Element | null;
    /**
     * A button that toggles fullscreen mode.\
     * Won't be rendered if fullscreen is not supported/allowed.
     */
    function Fullscreen(): JSX.Element | null;
    /**
     * An icon that shows when the media is loading.\
     * Will render an empty div if the media is already loaded.\
     * **Note:** `loading` is different from `buffering`, `seeking` and `stalled`.
     * It means that the player is waiting for the media-source to load, and
     * this happens only once per playlist item.
     */
    function Loading(): JSX.Element;
    /**
     * A text label showing the current track's metadata (title, artist, album).\
     * The metadata will be separated with the `controlsMetadataSeparator` config value (default: ` — `).\
     * Won't be rendered if the track has no metadata.
     */
    function Metadata(): JSX.Element | null;
    /**
     * A button that toggles the mute state of the media.\
     * Won't be rendered if muting is not supported/allowed.
     */
    function Mute(): JSX.Element | null;
    /**
     * A button that skips to the next track.\
     * Won't be rendered if there's no playlist or if it has only one item.
     */
    function Next(): JSX.Element | null;
    /**
     * A button that pauses the media.\
     * Won't be rendered if the media can't be paused.\
     * Will be disabled if the media is not loaded, is not playing or if there's an error.
     */
    function Pause(): JSX.Element | null;
    /**
     * A button that toggles Picture-in-Picture mode.\
     * Won't be rendered if Picture-in-Picture is not supported/allowed or if the media is not a video.
     */
    function PictureInPicture(): JSX.Element | null;
    /**
     * A button that plays the media.\
     * Will be disabled if the media is not loaded, is already playing or if there's an error.
     */
    function Play(): JSX.Element;
    /**
     * A button that opens a dropdown menu with the playlist.\
     * Won't be rendered if the playlist is empty.
     */
    function Playlist(): JSX.Element | null;
    /**
     * A button that plays or pauses the media.\
     * Will be disabled if the media is not loaded, if there's an error, or if the media is playing and can't be paused.\
     * Will display a loading indicator if the media is not loaded and the player is in 'controls' mode.
     */
    function PlayPause(): JSX.Element;
    /**
     * A button that skips to the previous track.\
     * Won't be rendered if there's no playlist or if it has only one item.
     */
    function Previous(): JSX.Element | null;
    /**
     * A text label showing the current track's remaining time.\
     * Will be rendered as `--:--` if the track is not loaded.\
     * Remaining time is calculated as `duration - currentTime` and is shown as a negative value.
     */
    function Remaining(): JSX.Element;
    /**
     * A button that toggles the repeat mode of the playlist.\
     * Won't be rendered if the playlist can't loop.
     */
    function Repeat(): JSX.Element | null;
    /**
     * A seekbar that allows the user to seek through the current track.\
     * Will be rendered as a simple progress bar if the track is not seekable, not loaded or has an error.\
     * The seekbar is accessible via keyboard arrows when the handle is focused.
     */
    function SeekBar(): JSX.Element;
    /**
     * A button that toggles the shuffle mode of the playlist.\
     * Won't be rendered if the playlist can't shuffle.
     */
    function Shuffle(): JSX.Element | null;
    /**
     * A spacer that fills any remaining space in the controls bar.\
     * Useful to push the controls to the left/right.
     */
    function Spacer(): JSX.Element;
    /**
     * A loading icon that shows when the media is stalled.\
     * Will render an empty div if the media is not stalled.\
     * **Note:** `stalled` is different from `loading`, it means that the player is expecting more data from the server, but it's not receiving it.
     */
    function Stalled(): JSX.Element;
    /**
     * A text label showing the current track's time.\
     * Will be rendered as `--:--` if the track is not loaded.
     */
    function Time(): JSX.Element;
    /**
     * A text label showing the current track's title.\
     * Won't be rendered if the track has no title.
     */
    function Title(): JSX.Element;
    /* ┐
    │ File: export.ts [/src/bits/controls/export.ts]
    │ Package: @rs1/media-player | RS1 Project
    │ Author: Andrea Corsini
    │ Created: May 4th, 2023 - 15:48:39
    │ Modified: May 4th, 2023 - 15:50:27
    │
    │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
    │ This work is licensed under the terms of the MIT License.
    │ For a copy, see https://opensource.org/licenses/MIT
    │ or the LICENSE file in the root of this project.
    └ */
    export { AirPlay as airplay, Album as album, Artist as artist, Backward10 as backward10, Duration as duration, Error as error, Forward10 as forward10, Fullscreen as fullscreen, Loading as loading, Metadata as metadata, Mute as mute, Next as next, Pause as pause, PictureInPicture as pictureinpicture, Play as play, Playlist as playlist, PlayPause as playpause, Previous as previous, Remaining as remaining, Repeat as repeat, SeekBar as seekbar, Shuffle as shuffle, Spacer as spacer, Stalled as stalled, Time as time, Title as title };
}
declare const controlGroups: Record<string, ControlsGroupType>;
declare const controlsConfig: Record<string, ControlsGridType>;
declare const configs: Record<string, MediaConfig>;
/**
 * From T, set to never all keys that are present in U
 * @see https://stackoverflow.com/a/66605669
 */
type Only<T, U> = {
    [P in keyof T]: T[P];
} & {
    [P in keyof U]?: never;
};
/**
 * Extending from Only<T, U>, return a union type where an object can be either T or U
 * @see https://stackoverflow.com/a/66605669
 */
type Either<T, U> = Only<T, U> | Only<U, T>;
declare const themes: Record<string, MediaTheme>;
type ConfigProviderProps = React.PropsWithChildren<{
    /**
     * The initial config to use.
     */
    config?: Partial<MediaConfig>;
}>;
/**
 * An AugmentedMediaElement is a wrapper around the HTMLMediaElement that provides a unified
 * interface for interacting with the media player.
 * In the future, this will be useful to support other media types (e.g. HLS, DASH, etc.) or
 * sources (e.g. YouTube, Vimeo, etc.). For now, it's just a wrapper around the HTMLMediaElement
 * that provides some useful methods and properties.
 */
interface AugmentedMediaElement extends Pick<HTMLMediaElement, "play" | "pause"> {
    // node reference
    /**
     * The underlying HTMLMediaElement. (<audio> or <video>)
     */
    current: HTMLMediaElement | null;
    // augmented methods
    /**
     * Alias for `pause()`
     */
    wait: () => Promise<void>;
    /**
     * Seek forward by the specified number of seconds.
     * A negative number will seek backward.
     * @param {number} time The number of seconds to seek by.
     * @returns {Promise<void>} A promise that resolves when the seek is complete.
     */
    skip: (time: number) => Promise<void>;
    /**
     * Ask the player to load the previous media item in the playlist.
     */
    previous: () => Promise<void>;
    /**
     * Ask the player to load the next media item in the playlist.
     */
    next: () => Promise<void>;
    // alias methods
    /**
     * Alias for `setTime(time)`
     */
    seekTo: (time: number) => Promise<void>;
    // augmented setters
    /**
     * Set the current time of the media player. (in seconds)
     * @param {number} time The time to seek to.
     * @returns {Promise<void>} A promise that resolves when the seek is complete.
     */
    setTime: (time: number) => Promise<void>;
    /**
     * Set the current progress of the media player. (in percent 0-1)
     * Progress is calculated as `time / duration` and clamped to the range 0-1.
     * @param {number} progress The progress to seek to.
     */
    setProgress: (progress: number) => Promise<void>;
    /**
     * Ask the player to mute/unmute the audio output.
     * @param {boolean | ((muted: boolean) => boolean)} muted A boolean or a function that given the current muted state returns the new muted state.
     */
    setMuted: (muted: boolean | ((muted: boolean) => boolean)) => Promise<void>;
    /**
     * Set the volume of the media player. (in percent 0-1)
     * @param {number | ((volume: number) => number)} volume A number or a function that given the current volume returns the new volume.
     */
    setVolume: (volume: number | ((volume: number) => number)) => Promise<void>;
    /**
     * Set the playback rate of the media player.
     * @param {MediaPlaybackRate | ((rate: MediaPlaybackRate) => MediaPlaybackRate)} rate A playback rate or a function that given the current playback rate returns the new playback rate.
     */
    setPlaybackRate: (rate: MediaPlaybackRate | ((rate: MediaPlaybackRate) => MediaPlaybackRate)) => Promise<void>;
    // augmented getters
    /**
     * Get the current time of the media player. (in seconds)
     * The time is garanteed to be a number, even if the media player is not ready yet. (in that case, it will be 0)
     */
    getTime: () => number;
    /**
     * Get the duration of the media player. (in seconds)
     * The duration is garanteed to be a number, even if the media player is not ready yet. (in that case, it will be 0)
     */
    getDuration: () => number;
    /**
     * Get the current progress of the media player. (in percent 0-1)
     * Progress is calculated as `time / duration` and clamped to the range 0-1.
     * The progress is garanteed to be a number, even if the media player is not ready yet. (in that case, it will be 0)
     */
    getProgress: () => number;
    /**
     * Get the current buffered progress of the media player. (in percent 0-1)
     * Buffered progress is calculated as `buffered / duration` and clamped to the range 0-1.
     * The buffered progress is garanteed to be a number, even if the media player is not ready yet. (in that case, it will be 0)
     */
    getBuffered: () => number;
    /**
     * Get the current muted state of the media player.
     * @returns Either `true` (muted) or `false` (unmuted)
     */
    getMuted: () => boolean;
    /**
     * Get the current volume of the media player. (as a float 0-1, where 0 is muted and 1 is max volume)
     */
    getVolume: () => number;
    /**
     * Get the current playback rate of the media player.
     * @returns Either `0.25`, `0.5`, `0.75`, `1`, `1.25`, `1.5`, `1.75`, or `2`
     */
    getPlaybackRate: () => MediaPlaybackRate;
    // augmented properties
    /**
     * Whether the media player is currently playing.
     */
    isPlaying: boolean;
    /**
     * Whether the media player is currently seeking, and in which direction.
     */
    isSeeking: "forward" | "backward" | false;
}
interface Props {
    /**
     * A callback that will be called when the augmented media element starts or stops playing.
     * @param {boolean} isPlaying Whether the media is playing or not.
     */
    onPlaybackChange?: (isPlaying: boolean) => void;
    /**
     * A callback that will be called when the augmented media element needs a new track to be loaded.
     * @param {number} track The index of the track to load. (negative values are used for previous tracks)
     */
    onTrackChange?: (track: number) => void;
    /**
     * Whether to keep the audio alive when the media element is not playing.
     * This is useful as a workaround for browsers that suspend the audio when the tab is not active.
     * Example: Safari on iOS.
     * @default false
     */
    keepAlive?: boolean;
}
type UseAugmentedMediaRef = readonly [
    AugmentedMediaElement | null,
    (node: HTMLMediaElement | null) => void,
    React.RefObject<HTMLMediaElement>
];
/**
 * Use this hook to get a reference to an `AugmentedMediaElement` from a `HTMLMediaElement`.
 * @example
 * ```js
 * // considering a standard media element component
 * const ref = useRef(null)
 *
 * return (
 *   <audio ref={ref} />
 * )
 *
 * // you can use the hook like this
 *
 * const onPlaybackChange = useCallback(isPlaying => {
 *    // do something...
 * }, [])
 *
 * const onTrackChange = useCallback(track => {
 *   // do something...
 * }, [])
 *
 * const [augmentedRef, setRef, mediaRef] = useAugmentedMediaRef({ onPlaybackChange, onTrackChange })
 *
 * // Now in `augmentedRef` you have an `AugmentedMediaElement` instance.
 * // In `mediaRef` you have the `HTMLMediaElement` instance. (equivalent to `ref.current` in the example above)
 *
 * return (
 *   <audio ref={setRef} />
 * )
 * ```
 */
declare function useAugmentedMediaRef(props: Props): UseAugmentedMediaRef;
type CoreProviderProps = React.PropsWithChildren;
/**
 * @typedef {Object} PlaylistProviderProps - The props of the `PlaylistProvider` component.
 * When the `track` prop is provided, the `playlist` prop is ignored.
 * Vice versa, when the `playlist` prop is provided, the `track` prop is ignored.
 * This allows to use the `PlaylistProvider` in two different ways:
 * - To play a collection of tracks.
 * - To play a single track.
 */
interface MultiTrackProviderProps extends React.PropsWithChildren {
    /**
     * The initial playlist.
     * @default []
     */
    playlist: RawMediaPlaylist | RawMediaPlaylist[];
}
interface SingleTrackProviderProps extends React.PropsWithChildren {
    /**
     * The initial active track.
     */
    track: RawMediaTrack | null;
}
type PlaylistProviderProps = Either<MultiTrackProviderProps, SingleTrackProviderProps> | (MultiTrackProviderProps & SingleTrackProviderProps);
type StateProviderProps = React.PropsWithChildren;
type ThemeProviderProps = React.PropsWithChildren<{
    theme?: Partial<MediaTheme> | string;
}>;
type TimeProviderProps = React.PropsWithChildren;
type CombinedProviderProps = ConfigProviderProps & ThemeProviderProps & PlaylistProviderProps & StateProviderProps & TimeProviderProps & CoreProviderProps;
/**
 * This is the main provider for the Media Player.
 * Place this as high as necessary in your component tree.
 * All children will have access to the player state, controls, config, etc.
 *
 * Remember to include the `<MediaPlayer />` component somewhere in your tree,
 * or replace it with your own custom player using the `useMediaElement` hook.
 * See the `<MediaPlayer />` component source code for more info.
 */
declare const CombinedProvider: React.FC<CombinedProviderProps>;
/**
 * Use this hook to access the theme currently used anywhere within a `MediaProvider`.
 * @returns {MediaTheme} The current MediaProvider theme.
 * @example
 * ```js
 * const theme = useMediaTheme()
 *
 * console.log('Controls color is', theme.controlsColor) // -> '#FFFFFF'
 * console.log('Controls background is', theme.controlsBackground) // -> '#000000'
 * console.log('Error color is', theme.errorColor) // -> '#FF0000'
 * ```
 */
declare const useMediaTheme: () => MediaTheme;
/**
 * Use this hook to access the current track anywhere within the `MediaProvider`.
 * The value returned by this hook works the same way as `useState`, so you can use it to update the current track.
 * @example
 * ```js
 * const [track, setTrack] = useTrack()
 *
 * // Option 1: Update the track directly
 * const changeTrackDirectly = useCallback(() => {
 *    if (track?.title === 'Never Gonna Give You Up') {
 *       setTrack({
 *          title: 'Never Gonna Let You Down',
 *          artist: 'Rick Astley',
 *          album: 'Whenever You Need Somebody',
 *       })
 *    }
 * }, [track, setTrack])
 *
 * // Option 2: Update the track based on the previous value
 * const changeTrack = useCallback(() => setTrack(t => {
 *    if (t?.title !== 'Never Gonna Give You Up') return t
 *    return {
 *       title: 'Never Gonna Let You Down',
 *       artist: 'Rick Astley',
 *       album: 'Whenever You Need Somebody',
 *    }
 * }), [setTrack])
 *
 * if (!track) return null
 *
 * return (
 *    <div>
 *       <h1>{track.title}</h1>
 *       <h2>{track.artist}</h2>
 *       <h3>{track.album}</h3>
 *       <button onClick={changeTrack}>Change track</button>
 *       <button onClick={changeTrackDirectly}>Change track directly</button>
 *    </div>
 * )
 * ```
 */
declare const useTrack: () => [
    MediaTrack | null,
    (track: string | number | RawMediaTrack | ((track: MediaTrack | null) => string | number | RawMediaTrack | null) | null) => void
];
/**
 * Use this hook to access the current playlist collection anywhere within the `MediaProvider`.\
 * The value returned by this hook works the same way as `useState`, so you can use
 * it to both read and update the playlist collection.
 * @example
 * ```js
 * const [collection, setCollection] = usePlaylistCollection()
 *
 * return (
 *    <div>
 *       <button onClick={() => setCollection([])}>Clear collection</button>
 *       <ul>
 *          {collection.map(playlist => (
 *             <li key={playlist.id}>
 *                <span>{playlist.title}</span>
 *                <ol>
 *                   {playlist.tracks.map(track => (
 *                      <li key={track.id}>{track.title}</li>
 *                   ))}
 *                </ol>
 *             </li>
 *          ))}
 *       </ul>
 *    </div>
 * )
 * ```
 */
declare const usePlaylistCollection: () => [
    MediaPlaylist[],
    (collection: RawMediaPlaylist | RawMediaPlaylist[] | ((collection: MediaPlaylist[]) => RawMediaPlaylist | RawMediaPlaylist[])) => void
];
/**
 * Use this hook to access the current playlist anywhere within the `MediaProvider`.\
 * The value returned by this hook works the same way as `useState`, so you can use
 * it to both read and update the active playlist.
 * @example
 * ```js
 * const [playlist, setPlaylist] = usePlaylist()
 *
 * return (
 *    <div>
 *       <button onClick={() => setPlaylist(null)}>Clear playlist</button>
 *       {playlist && (
 *          <ul>
 *             {playlist.tracks.map(({ title, id }) => (
 *                <li key={id}>{title}</li>
 *             ))}
 *          </ul>
 *       )}
 *    </div>
 * )
 * ```
 */
declare const usePlaylist: () => [
    MediaPlaylist | null,
    (playlist: string | number | RawMediaPlaylist | ((playlist: MediaPlaylist | null, track: MediaTrack | null) => string | number | RawMediaPlaylist | null) | null, track: string | number | RawMediaTrack | ((playlist: MediaPlaylist | null, track: MediaTrack | null) => string | number | RawMediaTrack | null) | null) => void
];
/**
 * Use this hook to access the playlist state anywhere within the `MediaProvider`.
 * @example
 * ```js
 * const playlistState = usePlaylistState()
 *
 * console.log('Is playlist shuffled?', playlistState.shuffle)
 * console.log('Is playlist repeating?', playlistState.mode === 'repeat')
 * console.log('Is playlist looping a single track?', playlistState.mode === 'repeat-one')
 * ```
 */
declare const usePlaylistState: () => PlaylistState;
/**
 * Use this hook to access the playlist controls anywhere within a `MediaProvider`.
 * @returns {PlaylistControls} A collection of functions to control the playlist.
 * @see {@link PlaylistControls}
 * @example
 * ```js
 * const { setTrack, skipTrackBy, toggleShuffle } = usePlaylistControls()
 *
 * // Skip to the next track
 * skipTrackBy(1)
 *
 * // Go to track 5
 * setTrack(5)
 *
 * // Enable/disable shuffle
 * toggleShuffle()
 * ```
 */
declare const usePlaylistControls: () => PlaylistControls;
/**
 * Use this hook to access the current state of the media player anywhere within the `MediaProvider`.
 * You can use this to react to changes in the player state, for example to show a loading indicator
 * when the player is buffering.
 * @returns {MediaState} The current playback state.
 * @see {@link MediaState}
 * @example
 * ```js
 * const { isWaiting } = useMediaState()
 *
 * return (
 *    <div>
 *       <CustomMediaPlayer />
 *       {isWaiting && <LoadingIndicator />}
 *    </div>
 * )
 * ```
 */
declare const useMediaState: () => MediaState;
/**
 * Use this hook to access the current time-state of the media player anywhere within a `MediaProvider`.
 * You can use this to react to changes in the player state, for
 * example to show a progress bar with the current time.
 * @returns {MediaTimeState} The current playback time-state.
 * @see {@link MediaTimeState}
 * @example
 * ```js
 * const { time, progress, duration, buffered } = useMediaTime()
 *
 * // Considering a media player for a track that lasts 3 minutes,
 * // with the playback at 1 minute and 30 seconds, and a currently
 * // buffered range from 1:00 to 2:06, the values would be:
 * console.log(time) // 90
 * console.log(progress) // 0.5
 * console.log(duration) // 180
 * console.log(buffered) // 0.7
 * ```
 */
declare const useMediaTime: () => MediaTimeState;
/**
 * Use this hook anywhere within a `MediaProvider` to get the correct props and refs needed to build a custom media player component.
 *
 * You will get the following properties:
 * - `node`: a wrapper around the HTMLMediaElement that provides a unified interface for interacting with the media player. (AugmentedMediaElement)
 * - `container`: a direct ref to the container element that wraps the media player.
 *   (eg: HTMLDivElement - equivalent of `containerRef.current`)
 * - `setRef`: a function that must be bound to the `ref` prop of the HTMLMediaElement.
 *   (eg: `<video ref={setRef} />`)
 * - `setContainerRef`: a function that must be bound to the `ref` prop of the container element.
 *   (eg: `<div ref={setContainerRef}>...</div>`)
 * - `props`: a set of props that must be spread on the HTMLMediaElement.
 *   (eg: `<video {...props} />`)
 *
 * **Note:** you can use this hook in any component to get access to the `AugmentedMediaElement`, but you should not use it to control
 * the media player unless you know what you're doing. Direct changes to the `AugmentedMediaElement` can cause the player to enter an
 * inconsistent state, and you should use the `useMediaControls` hook instead.
 * @example
 * ```js
 * const { container, setRef, setContainerRef, props } = useMediaElement()
 *
 * return (
 *   <div ref={setContainerRef}>
 *     <video ref={setRef} {...props} />
 *   </div>
 * )
 * ```
 */
declare const useMediaElement: () => {
    node: AugmentedMediaElement | null;
    container: HTMLElement | null;
    setRef: (node: HTMLMediaElement | null) => void;
    setContainerRef: (node: HTMLElement | null) => void;
    props: Partial<import("react").MediaHTMLAttributes<HTMLVideoElement> & import("react").VideoHTMLAttributes<HTMLVideoElement>>;
};
/**
 * Use this hook to access the media player controls anywhere within the `MediaProvider`.
 * You can use this to control the player from anywhere in your app, for example to skip to the next track.
 * @returns {MediaControls} A collection of functions to control the media player.
 * @see {@link MediaControls}
 * @example
 * ```js
 * const { togglePlay, seek, setVolume } = useMediaControls()
 *
 * // Play/pause the media player
 * togglePlay()
 *
 * // Seek to 1:30
 * seek(90)
 *
 * // Set the volume to 50%
 * setVolume(0.5)
 * ```
 */
declare const useMediaControls: () => MediaControls;
/**
 * Use this hook anywhere within a `MediaProvider` to enable keyboard controls.
 * By default, keyboard controls are attached to the `document` object, so they will work even if the media player is not focused.
 * You can change this behaviour by passing a ref to the element you want to attach the keyboard controls to.
 *
 * The kind of controls available depends on the current configuration. (refer to the `can*` properties in the `MediaConfig` interface)
 * @param {React.RefObject<HTMLElement>} [ref] The element to attach the keyboard controls to. If not specified, the `document` object will be used.
 * @example
 * ```js
 * const ref = useRef()
 * useMediaKeyboardControls(ref)
 *
 * return (
 *    <div ref={ref}>
 *       <CustomMediaPlayer />
 *    </div>
 * )
 * ```
 */
declare const useMediaKeyboardControls: (ref?: React.RefObject<HTMLElement>) => void;
/**
 * Use this hook anywhere within a `MediaProvider` to access the player mode currently in use.
 * @returns The current player mode.
 * @example
 * ```js
 * const playerMode = usePlayerMode()
 *
 * // Considering a configuration { playerMode: 'auto' }
 * console.log('Player mode is', playerMode) // -> 'video' or 'artwork' depending on the track type (video or audio)
 *
 * // Considering a configuration { playerMode: [['audio', 'vinyl'], ['video', 'video']] }
 * console.log('Player mode is', playerMode) // -> 'video' or 'vinyl' depending on the track type (video or audio)
 * ```
 */
declare const usePlayerMode: () => "video" | "artwork" | "vinyl" | "controls" | "artwork-mini" | "vinyl-mini";
/**
 * Use this hook anywhere within a `MediaProvider` to access the player controls currently in use.
 * @returns The current player controls.
 * @example
 * ```js
 * const playerControls = usePlayerControls()
 * ```
 */
declare const usePlayerControls: () => ControlsGridType;
/**
 * Use this hook anywhere within a `MediaProvider` to access the player background currently in use.
 * @returns The current player background.
 * @example
 * ```js
 * const playerBackground = usePlayerBackground()
 * ```
 */
declare const usePlayerBackground: () => "flat" | "none" | "blur";
type MediaSessionMetadata = {
    title?: string;
    artist?: string;
    album?: string;
    artwork?: string;
};
declare const setMediaSession: (media: AugmentedMediaElement | null, metadata: MediaSessionMetadata, forPlaylist: boolean) => void;
/**
 * Returns the current media provider configuration anywhere within the `MediaProvider`.
 * @see {@link MediaConfig}
 * @example
 * ```js
 * const { canSeek } = useMediaConfig()
 *
 * console.log('Seeking is', canSeek ? 'enabled' : 'disabled') // -> 'Seeking is enabled'
 * ```
 */
declare const useMediaConfig: () => MediaConfig;
type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";
type BreakpointSizes = Record<Breakpoint, number>;
type ExtendedBreakpoints = BreakpointSizes & {
    [K: string]: typeof K extends Breakpoint ? never : number;
};
type CustomBreakpoints = Partial<BreakpointSizes> | ExtendedBreakpoints;
/**
 * This is a list of predefined breakpoints.
 * Each number represents the minimum width of the breakpoint.
 */
declare const baseBreakpoints: BreakpointSizes;
/**
 * Extends the default breakpoints with the given ones.
 * @param {CustomBreakpoints} bps The breakpoints to add or override.
 * @returns {ExtendedBreakpoints} The extended breakpoints.
 * @example
 * ```js
 * const breakpoints = extendBreakpoints({ xs: 100, sm: 200 })
 * // breakpoints = { xs: 100, sm: 200, md: 992, lg: 1200, xl: Infinity }
 * ```
 */
declare const extendBreakpoints: (bps: CustomBreakpoints) => ExtendedBreakpoints;
/**
 * Returns the current breakpoint based on the window width.
 * @returns {Breakpoint | undefined} The current breakpoint.
 * @example
 * ```js
 * const breakpoint = useBreakpoint()
 * // On the first render:
 * // breakpoint = undefined
 * // Then, on consecutive renders:
 * // breakpoint = 'xs' → the window width is >= 0px and < 576px
 * // breakpoint = 'sm' → the window width is >= 576px and < 768px
 * // breakpoint = 'md' → the window width is >= 768px and < 992px
 * // breakpoint = 'lg' → the window width is >= 992px and < 1200px
 * // breakpoint = 'xl' → the window width is >= 1200px
 * // In case of error:
 * // breakpoint = undefined → the window width is unknown or doesn't match any breakpoint
 * ```
 */
declare function useBreakpoint(): Breakpoint | undefined;
/**
 * Returns the current breakpoint based on the window width.
 * @param {Breakpoint} defaultBreakpoint The default breakpoint to use for the first render, or if the window width is unknown/doesn't match any breakpoint.
 * @returns {Breakpoint | undefined} The current breakpoint.
 * @example
 * ```js
 * const breakpoint = useBreakpoint('sm')
 * // On the first render:
 * // breakpoint = 'sm'
 * // Then, on consecutive renders:
 * // breakpoint = 'xs' → the window width is >= 0px and < 576px
 * // breakpoint = 'sm' → the window width is >= 576px and < 768px
 * // breakpoint = 'md' → the window width is >= 768px and < 992px
 * // breakpoint = 'lg' → the window width is >= 992px and < 1200px
 * // breakpoint = 'xl' → the window width is >= 1200px
 * // In case of error:
 * // breakpoint = 'sm → the window width is unknown or doesn't match any breakpoint
 * ```
 */
declare function useBreakpoint(defaultBreakpoint: Breakpoint): Breakpoint | undefined;
/**
 * Returns the current breakpoint based on the window width.
 * @param {Breakpoint[]} neededBreakpoints The breakpoints that must be considered.
 * @returns {Breakpoint | undefined} The current breakpoint.
 * @example
 * ```js
 * const breakpoint = useBreakpoint(['sm', 'md'])
 * // On the first render:
 * // breakpoint = undefined
 * // Then, on consecutive renders:
 * // breakpoint = 'sm' → the window width is >= 0px and < 768px
 * // breakpoint = 'md' → the window width is >= 768px
 * // In case of error:
 * // breakpoint = undefined → the window width is unknown or doesn't match any breakpoint
 * ```
 */
declare function useBreakpoint(neededBreakpoints: Breakpoint[]): Breakpoint | undefined;
/**
 * Returns the current breakpoint based on the window width.
 * @param {CustomBreakpoints} customBreakpoints The breakpoints to use.
 * @see {@link extendBreakpoints} to extend the default breakpoints instead of replacing them.
 * @returns {Breakpoint | undefined} The current breakpoint.
 * @example
 * ```js
 * const breakpoint = useBreakpoint({ xs: 0, sm: 200 })
 * // On the first render:
 * // breakpoint = undefined
 * // Then, on consecutive renders:
 * // breakpoint = 'xs' → the window width is >= 0px and < 200px
 * // breakpoint = 'sm' → the window width is >= 200px
 * // In case of error:
 * // breakpoint = undefined → the window width is unknown or doesn't match any breakpoint
 * ```
 */
declare function useBreakpoint(customBreakpoints: CustomBreakpoints): Breakpoint | undefined;
/**
 * Returns the current breakpoint based on the window width.
 * @param {CustomBreakpoints} customBreakpoints The breakpoints to use.
 * @see {@link extendBreakpoints} to extend the default breakpoints instead of replacing them.
 * @param {Breakpoint[]} neededBreakpoints The breakpoints that must be considered.
 * @returns {Breakpoint | undefined} The current breakpoint.
 * @example
 * ```js
 * const breakpoint = useBreakpoint({ xs: 0, sm: 200 }, ['sm', 'md'])
 * // On the first render:
 * // breakpoint = undefined
 * // Then, on consecutive renders:
 * // breakpoint = 'sm' → the window width is >= 0px and < 200px
 * // In case of error:
 * // breakpoint = undefined → the window width is unknown or doesn't match any breakpoint
 * ```
 */
declare function useBreakpoint(customBreakpoints: CustomBreakpoints, neededBreakpoints: Breakpoint[]): Breakpoint | undefined;
/**
 * Returns the current breakpoint based on the window width.
 * @param {Breakpoint} defaultBreakpoint The default breakpoint to use for the first render, or if the window width is unknown/doesn't match any breakpoint.
 * @param {Breakpoint[]} neededBreakpoints The breakpoints that must be considered.
 * @returns {Breakpoint | undefined} The current breakpoint.
 * @example
 * ```js
 * const breakpoint = useBreakpoint('sm', ['sm', 'md'])
 * // On the first render:
 * // breakpoint = 'sm'
 * // Then, on consecutive renders:
 * // breakpoint = 'sm' → the window width is >= 0px and < 768px
 * // breakpoint = 'md' → the window width is >= 768px
 * // In case of error:
 * // breakpoint = 'sm' → the window width is unknown or doesn't match any breakpoint
 * ```
 */
declare function useBreakpoint(defaultBreakpoint: Breakpoint, neededBreakpoints: Breakpoint[]): Breakpoint | undefined;
/**
 * Returns the current breakpoint based on the window width.
 * @param {Breakpoint} defaultBreakpoint The default breakpoint to use for the first render, or if the window width is unknown/doesn't match any breakpoint.
 * @param {CustomBreakpoints} customBreakpoints The breakpoints to use.
 * @see {@link extendBreakpoints} to extend the default breakpoints instead of replacing them.
 * @returns {Breakpoint | undefined} The current breakpoint.
 * @example
 * ```js
 * const breakpoint = useBreakpoint('sm', { xs: 0, sm: 200 })
 * // On the first render:
 * // breakpoint = 'sm'
 * // Then, on consecutive renders:
 * // breakpoint = 'xs' → the window width is >= 0px and < 200px
 * // breakpoint = 'sm' → the window width is >= 200px
 * // In case of error:
 * // breakpoint = 'sm' → the window width is unknown or doesn't match any breakpoint
 * ```
 */
declare function useBreakpoint(defaultBreakpoint: Breakpoint, customBreakpoints: CustomBreakpoints): Breakpoint | undefined;
/**
 * Returns the current breakpoint based on the window width.
 * @param {Breakpoint} defaultBreakpoint The default breakpoint to use for the first render, or if the window width is unknown/doesn't match any breakpoint.
 * @param {CustomBreakpoints} customBreakpoints The breakpoints to use.
 * @see {@link extendBreakpoints} to extend the default breakpoints instead of replacing them.
 * @param {Breakpoint[]} neededBreakpoints The breakpoints that must be considered.
 * @returns {Breakpoint | undefined} The current breakpoint.
 * @example
 * ```js
 * const breakpoint = useBreakpoint('sm', { xs: 0, sm: 200 }, ['sm', 'md'])
 * // On the first render:
 * // breakpoint = 'sm'
 * // Then, on consecutive renders:
 * // breakpoint = 'sm' → the window width is >= 0px and < 200px
 * // In case of error:
 * // breakpoint = 'sm' → the window width is unknown or doesn't match any breakpoint
 * ```
 */
declare function useBreakpoint(defaultBreakpoint: Breakpoint, customBreakpoints: CustomBreakpoints, neededBreakpoints: Breakpoint[]): Breakpoint | undefined;
declare global {
    interface FullscreenAPIDocument extends Document {
        /* Standard APIs */
        exitFullscreen: () => Promise<void>;
        requestFullscreen: (element: HTMLElement) => Promise<void>;
        fullscreenElement: HTMLElement | null;
        readonly fullscreenEnabled: boolean;
        /* WebKit newer APIs */
        webkitExitFullscreen: () => Promise<void>;
        webkitRequestFullscreen: (element: HTMLElement) => Promise<void>;
        webkitFullscreenElement: HTMLElement | null;
        readonly webkitFullscreenEnabled: boolean;
        /* WebKit older APIs */
        webkitCancelFullScreen: () => Promise<void>;
        webkitRequestFullScreen: (element: HTMLElement) => Promise<void>;
        webkitFullScreenElement: HTMLElement | null;
        readonly webkitIsFullScreen: boolean;
        /* Firefox APIs */
        mozCancelFullScreen: () => Promise<void>;
        mozRequestFullScreen: (element: HTMLElement) => Promise<void>;
        mozFullScreenElement: HTMLElement | null;
        readonly mozFullScreenEnabled: boolean;
        /* Explorer APIs */
        msExitFullscreen: () => Promise<void>;
        msRequestFullscreen: (element: HTMLElement) => Promise<void>;
        msFullscreenElement: HTMLElement | null;
        readonly msFullscreenEnabled: boolean;
    }
    interface FullscreenAPIHTMLElement extends HTMLElement {
        /* Standard APIs */
        exitFullscreen: () => Promise<void>;
        requestFullscreen: () => Promise<void>;
        readonly fullscreen: boolean;
        /* WebKit newer APIs */
        webkitExitFullscreen: () => Promise<void>;
        webkitRequestFullscreen: () => Promise<void>;
        readonly webkitDisplayingFullscreen: boolean;
        /* WebKit older APIs */
        webkitCancelFullScreen: () => Promise<void>;
        webkitRequestFullScreen: () => Promise<void>;
        readonly webkitSupportsFullscreen: boolean;
        /* Firefox APIs */
        mozCancelFullScreen: () => Promise<void>;
        mozRequestFullScreen: () => Promise<void>;
        readonly mozFullScreen: boolean;
        /* Explorer APIs */
        msExitFullscreen: () => Promise<void>;
        msRequestFullscreen: () => Promise<void>;
        readonly msFullscreenElement: boolean;
    }
    interface FullscreenAPIHTMLMediaElement extends HTMLMediaElement {
        /* Standard APIs */
        enterFullscreen: () => Promise<void>;
        /* WebKit newer APIs */
        webkitEnterFullscreen: () => Promise<void>;
    }
}
declare function useTraceUpdate(props: {
    [key: string]: unknown;
}): void;
declare const __default$10: typeof useTraceUpdate;
interface UseKeepAliveAudio {
    initStream: () => void;
    playStream: () => void;
    stream: HTMLAudioElement | null;
}
/**
 * Returns a hidden audio element that is used to keep alive the audio focus.
 * This is useful on iOS / Safari, where the audio focus is lost when the
 * user navigates away from the page or locks the screen.
 * @returns {HTMLAudioElement | null} The keep alive audio element, or null on unsupported browsers.
 */
declare function useKeepAliveAudio(): UseKeepAliveAudio;
/**
 * Convert a time in seconds to a string in the format HH:MM:SS,
 * or MM:SS if the time is less than an hour.
 * @param {number} seconds the time in seconds
 * @param {boolean} roundTop whether to round the seconds up or down
 * @returns {string} the time in the format HH:MM:SS
 * @example timeToString(60.5) // '1:00'
 * @example timeToString(-60.5) // '-1:00'
 * @example timeToString(60.5, true) // '1:01'
 * @example timeToString(3600) // '1:00:00'
 */
declare function timeToString(seconds: number, roundTop?: boolean): string;
export { _default as MediaPlayer, _default as BaseControlButton, _default as BaseControlText, _default as BaseControlTime, controls, configs, controlGroups, controlsConfig, themes, CombinedProvider as MediaProvider, useMediaConfig, usePlayerMode, usePlayerControls, usePlayerBackground, useMediaTheme, useTrack, usePlaylistCollection, usePlaylist, usePlaylistState, usePlaylistControls, useMediaState, useMediaTime, useMediaElement, useMediaControls, useMediaKeyboardControls, useAugmentedMediaRef, __default$10 as useAirPlayAPI, __default$10 as useFullscreenAPI, __default$10 as usePiPAPI, __default$10 as useAutoRevertToggle, __default$10 as useDetectInteraction, __default$10 as useDoubleTap, __default$10 as useSlider, useBreakpoint, extendBreakpoints, baseBreakpoints, useKeepAliveAudio, setMediaSession, timeToString };
export type { BaseButtonProps, BaseTextProps, BaseTimeProps, MediaConfig, MediaPlaybackRate, MediaTheme, MediaType, MediaTrack, RawMediaTrack, PlaylistState, PlaylistControls, MediaSize, MediaState, MediaTimeState, MediaControls, Breakpoint, BreakpointSizes, CustomBreakpoints };
