/* ┐
   │ File: index.tsx [/src/bits/media/index.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 15:30:29
   │ Modified: May 3rd, 2023 - 17:13:09
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useTrack } from '@/media'

import MediaElement from './element'
import MediaSource from './source'
import MediaWrapper from './wrapper'

/**
 * This component is responsible for rendering the media element
 * composing the media components together.
 * We do so to separate the rendering loop between `MediaWrapper`,
 * `MediaElement` and `MediaSource` to avoid unnecessary re-renders.
 */
function Media() {
    const [track] = useTrack()

    return (
        <MediaWrapper>
            <MediaElement>
                {track && track.src.map((src, idx) => <MediaSource key={src} src={src} type={track.mimeType[idx]} />)}
            </MediaElement>
        </MediaWrapper>
    )
}

export default Media
