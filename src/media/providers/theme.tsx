/* ┐
   │ File: theme.tsx [/src/media/providers/theme.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 22:30:44
   │ Modified: April 28th, 2023 - 22:12:44
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React, { createContext } from 'react'

import { themes, useMediaThemeFactory } from '@media/factories/media-theme'

import { MediaTheme } from '../types'

export type ThemeProviderProps = React.PropsWithChildren<{
    theme?: Partial<MediaTheme> | string
}>

export const ThemeContext = createContext<MediaTheme>(themes.dark)

export function ThemeProvider(props: ThemeProviderProps) {
    const { theme: initialTheme = {}, children } = props

    const theme = useMediaThemeFactory(initialTheme)

    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}
