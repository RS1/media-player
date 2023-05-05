/* ┐
   │ File: element.tsx [/src/bits/media/element.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 15:30:29
   │ Modified: May 5th, 2023 - 13:21:25
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { useMediaElement, useMediaKeyboardControls, useTrack } from '@/media'

/**
 * This component renders the actual media element.
 * We always render a video element, even if the track is audio only.
 * We load the pertinent props from the `useMediaElement` hook.
 *
 * NOTE: if you want to implement a custom media element, you can do so by
 * creating a new component that uses the `useMediaElement` hook and renders
 * the element you want. Be sure to check `./source.tsx`, `./wrapper.tsx`, and
 * `./index.tsx` to see how the default media element is implemented.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
 */
function MediaElement(props: React.PropsWithChildren) {
    const { children } = props
    const [track] = useTrack()
    const { setRef, props: mediaProps } = useMediaElement()
    useMediaKeyboardControls()

    return (
        <video
            id='rmp-media-element'
            data-track={track && track.id}
            data-track-index={track && track.index}
            className='bg-media-bg w-full h-full'
            ref={setRef}
            {...mediaProps}
        >
            {children}
            <p className='text-sm'>Your browser doesn&#039;t support media playback.</p>
        </video>
    )
}

export default MediaElement
