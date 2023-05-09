/* ┐
   │ File: index.ts [/src/index.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: January 6th, 2021 - 12:29:42
   │ Modified: May 9th, 2023 - 14:56:15
   │ 
   │ Copyright (c) 2021 - 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */

// Components
export { default as MediaPlayer } from '@/bits'
export { default as BaseControlButton } from '@bits/controls/base-button'
export type { BaseButtonProps } from '@bits/controls/base-button'
export { default as BaseControlTag } from '@bits/controls/base-tag'
export type { BaseTagProps } from '@bits/controls/base-tag'
export { default as BaseControlText } from '@bits/controls/base-text'
export type { BaseTextProps } from '@bits/controls/base-text'
export { default as BaseControlTime } from '@bits/controls/base-time'
export type { BaseTimeProps } from '@bits/controls/base-time'
export * as controls from '@bits/controls/export'

// Types
export type {
    MediaConfig,
    MediaPlaybackRate,
    MediaTheme,
    MediaType,
    MediaTrack,
    RawMediaTrack,
    PlaylistState,
    PlaylistControls,
    MediaSize,
    MediaState,
    MediaTimeState,
    MediaControls,
} from '@media/types'

// Default config, themes and controls
export { configs, controlGroups, controlsConfig } from '@media/factories/media-config'
export { themes } from '@media/factories/media-theme'

// Providers
export { CombinedProvider as MediaProvider } from '@media/providers/combined'

/* Media hooks */
// MediaConfig
export { useMediaConfig } from '@media/hooks/use-media-config'
export { usePlayerMode } from '@media/hooks/use-player-mode'
export { usePlayerRatio } from '@media/hooks/use-player-ratio'
export { usePlayerControls } from '@media/hooks/use-player-controls'
export { usePlayerBackground } from '@media/hooks/use-player-background'
// MediaTheme
export { useMediaTheme } from '@media/hooks/use-media-theme'
// Track, Playlist, PlaylistState, PlaylistControls
export { useTrack } from '@media/hooks/use-track'
export { usePlaylistCollection } from '@media/hooks/use-playlist-collection'
export { usePlaylist } from '@media/hooks/use-playlist'
export { usePlaylistState } from '@media/hooks/use-playlist-state'
export { usePlaylistControls } from '@media/hooks/use-playlist-controls'
// MediaState, MediaTimeState
export { useMediaState } from '@media/hooks/use-media-state'
export { useMediaTime } from '@media/hooks/use-media-time'
// MediaElement, MediaControls, AugmentedMediaRef
export { useMediaElement } from '@media/hooks/use-media-element'
export { useMediaControls } from '@media/hooks/use-media-controls'
export { useMediaKeyboardControls } from '@media/hooks/use-media-keyboard-controls'
export { useAugmentedMediaRef } from '@media/hooks/use-augmented-media-ref'

/* Useful hooks and utils */
// Types
export type { Breakpoint, BreakpointSizes, CustomBreakpoints } from '@/hooks'
// Hooks
export {
    // API Wrappers
    useAirPlayAPI,
    useRemotePlaybackAPI,
    useFullscreenAPI,
    usePiPAPI,
    // State
    useAutoRevertToggle,
    // Interaction
    useDetectInteraction,
    useDoubleTap,
    useSlider,
    // Window
    useBreakpoint,
    extendBreakpoints,
    baseBreakpoints,
    // Audio
    useKeepAliveAudio,
} from '@/hooks'
// Utils
export { setMediaSession } from '@media/utils/media-session'
export { timeToString } from '@utils/string'
