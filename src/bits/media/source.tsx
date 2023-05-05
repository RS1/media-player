/* ┐
   │ File: source.tsx [/src/bits/media/source.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 15:30:29
   │ Modified: May 3rd, 2023 - 17:14:01
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

/**
 * Simple wrapper for the <source> tag.
 * We accept `src` and `type` as props and return the corresponding <source> tag.
 */
function MediaSource(props: { src?: string; type?: string }) {
    const { src, type } = props

    return <source key={src} src={src} type={type} />
}

export default MediaSource
