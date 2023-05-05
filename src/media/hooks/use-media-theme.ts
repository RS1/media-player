/* ┐
   │ File: use-media-theme.ts [/src/media/hooks/use-media-theme.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 24th, 2023 - 9:50:47
   │ Modified: May 4th, 2023 - 12:26:43
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useContext } from 'react'

import { ThemeContext } from '@media/providers/theme'

/**
 * Use this hook to access the theme currently used anywhere within a `MediaProvider`.
 * @returns {MediaTheme} The current MediaProvider theme.
 * @example
 * ```js
 * const theme = useMediaTheme()
 *
 * console.log('Controls color is', theme.controlsColor) // -> '#FFFFFF'
 * console.log('Controls background is', theme.controlsBackground) // -> '#000000'
 * console.log('Error color is', theme.errorColor) // -> '#FF0000'
 * ```
 */
export const useMediaTheme = () => {
    const cx = useContext(ThemeContext)
    if (!cx) {
        throw new Error('useMediaTheme must be used within a MediaProvider')
    }
    return cx
}
