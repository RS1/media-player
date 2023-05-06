/* ┐
   │ File: types.ts [/src/media/types.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 17:44:35
   │ Modified: May 6th, 2023 - 20:53:42
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { ControlKey, ControlsGridType } from '@bits/controls/types'

import { AspectRatio } from '@media/utils/aspect-ratio'

import { Breakpoint, CustomBreakpoints } from '..'

export type MediaType = 'audio' | 'video'

/**
 * Defines a new type that depends on media types.
 * Given a type `T`, it returns a type that allows either `T` directly
 * or an array of tuples of the form `[MediaType, T]`.
 */
export type WithMediaType<T> = T | [MediaType, T][]

/**
 * Defines a new type that depends on breakpoints.
 * Given a type `T`, it returns a type that allows either `T` directly
 * or a map of the form `{ [Breakpoint]: T }`.
 */
export type WithBreakpoint<T> =
    | T
    | {
          [K in Breakpoint]?: T
      }

/**
 * The configuration object for the media player.
 * This object needs to be passed to the `MediaProvider` component via the `config` prop.
 * It will then be available to all the children components via the `useMediaConfig` hook.
 */
export interface MediaConfig {
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
    aspectRatio: AspectRatio
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
    playerMode: WithBreakpoint<
        WithMediaType<'auto' | 'video' | 'artwork' | 'vinyl' | 'controls' | 'artwork-mini' | 'vinyl-mini'>
    >
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
    playerBackground: WithBreakpoint<'none' | 'flat' | 'blur'>
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
    breakpoints: CustomBreakpoints
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
    autoHideControls: number | boolean
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
    controls: WithBreakpoint<ControlsGridType | false>
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
    controlsMetadataSeparator: string
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
    autoPlay: boolean
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
    loop: boolean
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
    muted: boolean
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
    canControlWithKeyboard: boolean
    /**
     * Whether the playlist can be shuffled via the UI/keyboard.
     * @default true
     */
    canShuffle: boolean
    /**
     * Whether the current video/track can be looped via the UI/keyboard.
     * (Loop means that the current video/track will be played again when it ends.)
     * @default true
     */
    canLoop: boolean
    /**
     * Whether the player can be paused via the UI/keyboard.
     * @default true
     */
    canPause: boolean
    /**
     * Whether the player can seek to a specific time via the UI/keyboard.
     * @default true
     */
    canSeek: boolean
    /**
     * Whether the player can be muted via the UI/keyboard.
     * @default true
     */
    canMute: boolean
    /**
     * Whether the player volume can be changed via the UI/keyboard.
     * @default true
     */
    canChangeVolume: boolean
    /**
     * Whether the player playback rate can be changed via the UI/keyboard.
     * @default true
     */
    canChangePlaybackRate: boolean
    /**
     * Whether the player can enter/exit fullscreen via the UI/keyboard.
     * @default true
     */
    canFullscreen: boolean
    /**
     * Whether the player can enter/exit picture-in-picture via the UI/keyboard.
     * @default true
     */
    canPictureInPicture: boolean
    /**
     * Whether the player can stream to AirPlay via the UI/keyboard.
     * @default true
     */
    canAirPlay: boolean
    /**
     * Whether the user should be able to tap/click on the player to toggle play/pause.
     * - For `vinyl`/`artwork` mode this means tapping on the artwork.
     * - For `video` mode this means tapping on the video.
     * This has no effect if `canPause` is `false`, or if the player mode is `controls`.
     * @default true
     */
    canTapToPause: boolean
    /**
     * Whether the user should be able to double tap/click on the player to seek.
     * (Double tap on the left side of the player to seek backward 10 seconds, double tap on the right side to seek forward 10 seconds.)
     * - For `vinyl`/`artwork` mode this means double tapping on the artwork.
     * - For `video` mode this means double tapping on the video.
     * This has no effect if `canSeek` is `false`, or if the player mode is `controls`, `artwork-mini`, or `vinyl-mini`.
     * @default true
     */
    canDoubleTapToSeek: boolean
}

/**
 * A collection of functions to control the media.
 * These functions are available to all the `MediaProvider` children via the `useMediaControls` hook.
 */
export interface MediaControls {
    /**
     * Starts playing the media.
     */
    play: () => void
    /**
     * Pauses the media.
     */
    pause: () => void
    /**
     * Toggles play/pause.
     * (If the media is playing it will be paused, if the media is paused it will be played.)
     */
    togglePlay: () => void
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
    seek: (time: number) => void
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
    skip: (offset: number) => void
    /**
     * Skips to the next video/track in the playlist.
     * If the current video/track is the last one in the playlist, it will skip to the first video/track.
     * @example
     * ```
     * const { next } = useMediaControls()
     * next()
     * ```
     */
    next: () => void
    /**
     * Skips to the previous video/track in the playlist.
     * If the current video/track is the first one in the playlist, it will skip to the last video/track.
     * @example
     * ```
     * const { previous } = useMediaControls()
     * previous()
     * ```
     */
    previous: () => void
    /**
     * Mutes the media.
     * @example
     * ```
     * const { mute } = useMediaControls()
     * mute()
     * ```
     */
    mute: () => void
    /**
     * Unmutes the media.
     * @example
     * ```
     * const { unmute } = useMediaControls()
     * unmute()
     * ```
     */
    unmute: () => void
    /**
     * Toggles the media mute state.
     * (If the media is muted it will be unmuted, if the media is unmuted it will be muted.)
     * @example
     * ```
     * const { toggleMute } = useMediaControls()
     * toggleMute()
     * ```
     */
    toggleMute: () => void
    /**
     * Pushes the player into fullscreen mode.
     * @example
     * ```
     * const { enterFullscreen } = useMediaControls()
     * enterFullscreen()
     * ```
     */
    enterFullscreen: () => void
    /**
     * Exits fullscreen mode.
     * @example
     * ```
     * const { exitFullscreen } = useMediaControls()
     * exitFullscreen()
     * ```
     */
    exitFullscreen: () => void
    /**
     * Toggles fullscreen mode.
     * (If the player is in fullscreen mode it will exit fullscreen mode, if the player is not in fullscreen mode it will enter fullscreen mode.)
     * @example
     * ```
     * const { toggleFullscreen } = useMediaControls()
     * toggleFullscreen()
     * ```
     */
    toggleFullscreen: () => void
    /**
     * Pushes the player into picture-in-picture mode.
     * It works only if the browser supports picture-in-picture and a video is playing.
     * @example
     * ```
     * const { enterPiP } = useMediaControls()
     * enterPiP()
     * ```
     */
    enterPiP: () => void
    /**
     * Exits picture-in-picture mode.
     * @example
     * ```
     * const { exitPiP } = useMediaControls()
     * exitPiP()
     * ```
     */
    exitPiP: () => void
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
    togglePiP: () => void
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
    setProgress: (progress: number | ((progress: number) => number)) => void
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
    setVolume: (volume: number | ((volume: number) => number)) => void
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
    setPlaybackRate: (
        playbackRate: MediaPlaybackRate | ((playbackRate: MediaPlaybackRate) => MediaPlaybackRate),
    ) => void
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
export type Color =
    | `#${string}`
    | `rgb(${number}, ${number}, ${number})`
    | `rgba(${number}, ${number}, ${number}, ${number})`
    | `hsl(${number}, ${number}%, ${number}%)`
    | `hsla(${number}, ${number}%, ${number}%, ${number})`
    | 'transparent'
    | 'currentcolor'
    | 'inherit'

/**
 * The theme object for the media player.
 * This object needs to be passed to the `MediaProvider` component via the `theme` prop.
 * It will then be available to all the children components via the `useMediaTheme` hook.
 *
 * See `./src/media/factories/media-theme.ts` for the default themes.
 */
export interface MediaTheme extends Partial<Record<ControlKey | keyof MediaTrack, Color>> {
    /**
     * The foreground color of the controls.
     * This means for example the color of the play/pause button, the seek bar, etc.
     *
     * **Example:** `#EEEEEE`
     */
    controlsColor: Color
    /**
     * The background color of the controls.
     * When the player is in `video` mode, this (faded and blurred) will be the color of the controls bar.
     * When the player is in `artwork`, `vinyl`, or `controls` mode:
     * - if the `playerBackground` is set to `none`, this will have no effect,
     * - if the `playerBackground` is set to `flat` or `blur`, this will be the background of the player.
     *
     * **Example:** `#000000`
     */
    controlsBg: Color
    /**
     * The color of the controls when hovered.
     * This means for example the color of the play/pause button when hovered.
     *
     * **Example:** `#FFFFFF`
     */
    accentColor: Color
    /**
     * The color to use for the error message and the error icon.
     * (When the media player fails to load a media track)
     *
     * **Example:** `#FF0000`
     */
    errorColor: Color
    /**
     * The background color of the playing media.
     * This will have different effects depending on the mode of the player:
     * - `video`: this will be the background of the player.
     * - `artwork`: this will be the background of the artwork (only visible if the artwork has transparent parts).
     * - all others: this will have no effect.
     *
     * **Example:** `#000000`
     */
    mediaBg: Color
    /**
     * The font family to use for the media player.
     *
     * **Example:** `"Arial", sans-serif`
     */
    textFont: string
    /**
     * The font family to use for the mono-spaced text in the media player.
     * (For example the time in the seek bar)
     *
     * **Example:** `"Courier New", monospace`
     */
    monoFont: string
}

/**
 * @typedef {Object} MediaTrack - A representation of a media track.
 */
export interface MediaTrack {
    /**
     * The source(s) of the media track.\
     * If multiple sources are provided, the first one that is supported by the browser will be used.
     */
    src: string[]
    /**
     * The type of the media track, either `audio` or `video`.
     */
    type: MediaType
    /**
     * The MIME type of the media track.\
     * If multiple sources are provided, this should be an array of MIME types.\
     * If not provided, the MIME type will be inferred from the source(s) extension(s).
     */
    mimeType: string[]
    /**
     * The unique ID of the media track.\
     * Useful for identifying the track in the playlist or setting the active track later on.
     */
    id: string | number
    /**
     * The index of the media track in the playlist.
     */
    index: number
    /**
     * The title of the media track.
     */
    title?: string
    /**
     * The artist of the media track.
     */
    artist?: string
    /**
     * The album of the media track.
     */
    album?: string
    /**
     * An URL to the cover of the media track.\
     * It will be used as the cover of the track in the `artwork`/`vinyl` mode.
     */
    cover?: string
    /**
     * An URL to the artwork of the media track.\
     * It will be used in the MediaSession API (Native media controls).\
     * It will serve as a fallback cover for the `artwork`/`vinyl` mode.
     */
    artwork?: string
    /**
     * An URL to the poster of the media track.\
     * It will be used as the poster of the media player.\
     * It will serve as a fallback artwork for the MediaSession API.
     */
    poster?: string
    /**
     * Optionally, a string representing the track side.\
     * Useful for dual-sided vinyls. (A/B)
     */
    side?: string
    /**
     * Optionally, a string or number representing the track position.\
     * Useful for tracklists. (1, 2, 3, ...)
     */
    position?: string | number
    /**
     * If the track request should include CORS headers, set this to `anonymous` or `use-credentials`.\
     * If not provided, the track will be requested without CORS headers.
     */
    crossOrigin?: 'anonymous' | 'use-credentials'
}

export type RawMediaTrack = Omit<MediaTrack, 'type' | 'src' | 'mimeType' | 'id' | 'index' | 'crossOrigin'> & {
    src: string | string[]
    mimeType?: string | string[]
    id?: string | number
    type?: MediaType
    crossOrigin?: 'anonymous' | 'use-credentials' | '' | boolean
}

/**
 * @typedef {Object} MediaPlaylist - A representation of a media playlist.
 */
export interface MediaPlaylist {
    /**
     * The unique ID of the playlist.
     */
    id: string
    /**
     * The title of the playlist.
     */
    title?: string
    /**
     * The artist of the playlist.
     */
    artist?: string
    /**
     * The album of the playlist.
     */
    album?: string
    /**
     * An URL to the artwork of the playlist.
     */
    artwork?: string
    /**
     * An array of media tracks in the playlist.
     */
    tracks: MediaTrack[]
}
export type RawMediaPlaylist = Omit<MediaPlaylist, 'id' | 'tracks'> & {
    id?: string
    tracks: RawMediaTrack[]
}

/**
 * A collection of functions to control the playlist.
 * These functions are available to all the `MediaProvider` children via the `usePlaylistControls` hook.
 */
export interface PlaylistControls {
    /**
     * Activates the loop state for the current track.
     * @example
     * ```js
     * const { loop } = usePlaylistControls()
     * loop()
     * ```
     */
    loop: () => void
    /**
     * Deactivates the loop state for the current track.
     * @example
     * ```js
     * const { unloop } = usePlaylistControls()
     * unloop()
     * ```
     */
    unloop: () => void
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
    toggleLoop: () => void
    /**
     * Shuffles the current playlist.
     * @example
     * ```js
     * const { shuffle } = usePlaylistControls()
     * shuffle()
     * ```
     */
    shuffle: () => void
    /**
     * Unshuffles the current playlist.
     * @example
     * ```js
     * const { unshuffle } = usePlaylistControls()
     * unshuffle()
     * ```
     */
    unshuffle: () => void
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
    toggleShuffle: () => void
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
    setTrack: (track: RawMediaTrack | string | number | null) => void
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
    skipTrackBy: (offset: number) => void
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
    previousTrack: () => void
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
    nextTrack: () => void
}

/**
 * @typedef {Object} PlaylistState - holds the state of the playlist
 */
export interface PlaylistState {
    /**
     * Whether the playlist is currently shuffled.
     */
    shuffle: boolean
    /**
     * The repeat mode of the playlist.
     * - `repeat` - The playlist will be repeated.
     * (1 -> 2 -> 3 -> 1 -> 2 -> 3 -> ...) — *default*
     * - `repeat-one` - The active track will be repeated.
     * (1 -> 1 -> 1 -> 1 -> ...)
     */
    mode: 'repeat' | 'repeat-one'
}

/**
 * Media intrinsic size in pixels.
 */
export type MediaSize = readonly [number, number]

/**
 * Media playback rate as float between 0.25 and 2 in steps of 0.25.
 */
export type MediaPlaybackRate = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2

/**
 * @typedef {Object} MediaState - holds the state of the media player
 */
export interface MediaState {
    /**
     * Whether the media was playing before the last pause.
     * This is used to restore the playback state after an interruption-caused pause.
     * E.g. when the `MediaTrack` changes or the user exits fullscreen/PiP.
     * @private
     * @default false
     */
    wasPlaying: boolean
    /**
     * Whether the media is currently playing.
     * @default false
     */
    isPlaying: boolean
    /**
     * Whether the media is currently waiting for data to be loaded.
     * @default false
     */
    isWaiting: boolean
    /**
     * Whether the media is currently stalled. (is waiting for data but the data is not coming)
     * @default false
     */
    isStalled: boolean
    /**
     * Whether the media is currently seeking, and if so, in which direction.
     * @default false
     */
    isSeeking: 'forward' | 'backward' | false
    /**
     * Whether the media is currently loaded and ready to play.
     * @default false
     */
    isLoaded: boolean
    /**
     * Whether the media is currently muted.
     * @default false
     */
    isMuted: boolean
    /**
     * Whether the media is currently in fullscreen mode.
     * @default false
     */
    isFullscreen: boolean
    /**
     * Whether the media is currently in Picture-in-Picture mode.
     * @default false
     */
    isPictureInPicture: boolean
    /**
     * Whether the media is currently in AirPlay mode.
     * @default false
     */
    isAirPlay: boolean

    /**
     * Whether the media has encountered an error, and if so, the error message.
     * @default false
     */
    hasError: string | false
    /**
     * Whether the media has loaded data.
     * @default false
     */
    hasLoadedData: boolean
    /**
     * Whether the media has loaded at least the metadata.
     * Metadata includes the duration, the intrinsic size, etc.
     * @default false
     */
    hasLoadedMetadata: boolean

    /**
     * The current volume as a float between 0 and 1.
     * @default 1
     */
    volume: number
    /**
     * The current playback rate as a float between 0.25 and 2 in steps of 0.25.
     * @see MediaPlaybackRate
     * @default 1
     */
    playbackRate: MediaPlaybackRate
    /**
     * The intrinsic size of the media in pixels.
     * @see MediaSize
     * @default [0, 0]
     */
    intrinsicSize: MediaSize
}

/**
 * @typedef {Object} MediaTimeState - Holds the current time, duration, progress and buffer of the media.
 */
export interface MediaTimeState {
    /**
     * The current playback time in seconds.
     * @default 0
     */
    time: number
    /**
     * The total duration of the media in seconds.
     * @default 0
     */
    duration: number
    /**
     * The current playback progress as a float between 0 and 1.
     * This is calculated as `time / duration`.
     * @default 0
     */
    progress: number
    /**
     * The current buffered time as a float between 0 and 1.
     * This is calculated as `buffered / duration`.
     * @default 0
     */
    buffered: number
}
