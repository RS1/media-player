/* ┐
   │ File: index.ts [/src/media/index.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 22:33:55
   │ Modified: May 9th, 2023 - 14:55:57
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */

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
} from './types'
export type { AugmentedMediaElement } from './hooks/use-augmented-media-ref'

// Providers
export { CombinedProvider } from './providers/combined'

// Config hooks
export { useMediaConfig } from './hooks/use-media-config'

// Theme hooks
export { useMediaTheme } from './hooks/use-media-theme'

// Playlist hooks
export { useTrack } from './hooks/use-track'
export { usePlaylistCollection } from './hooks/use-playlist-collection'
export { usePlaylist } from './hooks/use-playlist'
export { usePlaylistState } from './hooks/use-playlist-state'
export { usePlaylistControls } from './hooks/use-playlist-controls'

// State hooks
export { useMediaState } from './hooks/use-media-state'

// Time hooks
export { useMediaTime } from './hooks/use-media-time'

// Media hooks
export { useMediaElement } from './hooks/use-media-element'
export { useMediaControls } from './hooks/use-media-controls'
export { useMediaKeyboardControls } from './hooks/use-media-keyboard-controls'

// Generic hooks
export { useAugmentedMediaRef } from './hooks/use-augmented-media-ref'
export { usePlayerMode } from './hooks/use-player-mode'
export { usePlayerRatio } from './hooks/use-player-ratio'
export { usePlayerControls } from './hooks/use-player-controls'
export { usePlayerBackground } from './hooks/use-player-background'

// Utils
export { themeToCSSVars } from './factories/media-theme'
export { setMediaSession } from './utils/media-session'
export { getAspectRatio, getPaddingForAspectRatio } from './utils/aspect-ratio'
