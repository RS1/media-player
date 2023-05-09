/* ┐
   │ File: index.tsx [/src/bits/controls/index.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 21st, 2023 - 16:50:22
   │ Modified: May 9th, 2023 - 12:40:23
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import AirPlay from './item-airplay'
import Album from './item-album'
import Artist from './item-artist'
import Backward10 from './item-backward10'
import Cast from './item-cast'
import Duration from './item-duration'
import Error from './item-error'
import Forward10 from './item-forward10'
import Fullscreen from './item-fullscreen'
import Index from './item-index'
import Loading from './item-loading'
import Metadata from './item-metadata'
import Mute from './item-mute'
import Next from './item-next'
import Pause from './item-pause'
import PictureInPicture from './item-pictureinpicture'
import Play from './item-play'
import Playlist from './item-playlist'
import PlayPause from './item-playpause'
import Position from './item-position'
import Prefix from './item-prefix'
import Previous from './item-previous'
import Remaining from './item-remaining'
import Repeat from './item-repeat'
import SeekBar from './item-seekbar'
import Shuffle from './item-shuffle'
import Spacer from './item-spacer'
import Stalled from './item-stalled'
import Suffix from './item-suffix'
import Time from './item-time'
import Title from './item-title'
import { ControlKey, CustomControlProps } from './types'

/**
 * This map contains all the controls that are available to be used in the `controls` property of the `MediaConfig` object.
 */
export const controls: Record<ControlKey, React.ComponentType<CustomControlProps>> = {
    // See `./item-*.tsx` for the implementation of each control.
    // This map allows to reference each control by its name. (e.g. `controls.playpause` in MediaConfig)
    playpause: PlayPause,
    play: Play,
    pause: Pause,
    backward10: Backward10,
    forward10: Forward10,
    previous: Previous,
    next: Next,
    mute: Mute,
    fullscreen: Fullscreen,
    pictureinpicture: PictureInPicture,
    shuffle: Shuffle,
    repeat: Repeat,
    airplay: AirPlay,
    cast: Cast,
    playlist: Playlist,
    loading: Loading,
    stalled: Stalled,
    error: Error,
    seekbar: SeekBar,
    time: Time,
    duration: Duration,
    remaining: Remaining,
    spacer: Spacer,
    title: Title,
    artist: Artist,
    album: Album,
    metadata: Metadata,
    index: Index,
    position: Position,
    prefix: Prefix,
    suffix: Suffix,
    empty: () => <div />,
}
