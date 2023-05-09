/* ┐
   │ File: use-player-background.ts [/src/media/hooks/use-player-background.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: May 2nd, 2023 - 10:09:12
   │ Modified: May 9th, 2023 - 14:49:04
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useConfigProperty } from './use-config-property'
import { useMediaConfig } from './use-media-config'

/**
 * Use this hook anywhere within a `MediaProvider` to access the player background currently in use.
 * @returns The current player background.
 * @example
 * ```js
 * const playerBackground = usePlayerBackground()
 * ```
 */
export const usePlayerBackground = () => {
    const { playerBackground } = useMediaConfig()

    const background = useConfigProperty(playerBackground, 'none')

    return background
}
