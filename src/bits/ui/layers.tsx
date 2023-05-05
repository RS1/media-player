/* ┐
   │ File: layers.tsx [/src/bits/ui/layers.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: May 3rd, 2023 - 12:16:18
   │ Modified: May 3rd, 2023 - 16:09:13
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import MediaLayerStack from '@bits/layers'

import { usePlayerMode } from '@/media'
import { MediaPlayerMode } from '@media/types'

const supportedModes: MediaPlayerMode[] = ['vinyl', 'vinyl-mini', 'artwork', 'artwork-mini']

export default function LayerStack() {
    const playerMode = usePlayerMode()

    if (!supportedModes.includes(playerMode)) return null

    return <MediaLayerStack />
}
