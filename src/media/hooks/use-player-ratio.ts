/* ┐
   │ File: use-player-ratio.ts [/src/media/hooks/use-player-ratio.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: May 2nd, 2023 - 10:09:12
   │ Modified: May 9th, 2023 - 14:55:19
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { aspectRatios } from '@media/utils/aspect-ratio'

import { useConfigProperty } from './use-config-property'
import { useMediaConfig } from './use-media-config'
import { usePlayerMode } from './use-player-mode'

/**
 * Use this hook anywhere within a `MediaProvider` to access the player aspect-ratio currently in use.
 * @returns The current player aspect-ratio.
 * @example
 * ```js
 * const playerRatio = usePlayerRatio()
 * ```
 */
export const usePlayerRatio = () => {
    const { aspectRatio } = useMediaConfig()
    const playerMode = usePlayerMode()

    const ratio = useConfigProperty(aspectRatio, 'stretch')

    if (ratio === 'auto' || ratio === 'stretch') return ratio
    if (aspectRatios.includes(ratio) && playerMode === 'video') return ratio

    return 'stretch'
}
