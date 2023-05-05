/* ┐
   │ File: use-media-config.ts [/src/media/hooks/use-media-config.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 22nd, 2023 - 14:48:23
   │ Modified: May 4th, 2023 - 12:53:32
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useContext } from 'react'

import { ConfigContext } from '@media/providers/config'

/**
 * Returns the current media provider configuration anywhere within the `MediaProvider`.
 * @see {@link MediaConfig}
 * @example
 * ```js
 * const { canSeek } = useMediaConfig()
 *
 * console.log('Seeking is', canSeek ? 'enabled' : 'disabled') // -> 'Seeking is enabled'
 * ```
 */
export const useMediaConfig = () => {
    const cx = useContext(ConfigContext)
    if (!cx) {
        throw new Error('useMediaConfig must be used within a MediaProvider')
    }
    return cx
}
