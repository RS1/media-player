/* ┐
   │ File: media-theme.ts [/src/media/factories/media-theme.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 24th, 2023 - 9:52:32
   │ Modified: May 4th, 2023 - 15:09:57
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useEffect, useState } from 'react'

import { MediaTheme } from '@media/types'

import { camelToKebabCase } from '@utils/string'
import { CamelToKebabCase, Entries } from '@utils/types'

const base: MediaTheme = {
    controlsColor: '#f5f5f5',
    controlsBg: '#171717',
    accentColor: '#ffffff',
    errorColor: '#ed4337',
    mediaBg: '#171717',
    textFont: "'Verdana', sans-serif",
    monoFont: "'Courier', monospace",
}

const dark: MediaTheme = base

const light: MediaTheme = {
    ...base,
    controlsColor: '#171717',
    controlsBg: '#f5f5f5',
    accentColor: '#000000',
    mediaBg: '#f5f5f5',
}

export const themes: Record<string, MediaTheme> = {
    dark,
    light,
}

type ThemeCSSVars = {
    [K in CamelToKebabCase<keyof MediaTheme> as `--rmp-${K}`]: string
}

export function themeToCSSVars(theme: MediaTheme) {
    return Object.fromEntries(
        Object.entries(theme).map(entry => {
            const [key, value] = (entry || []) as [keyof MediaTheme, string]
            return [`--rmp-${camelToKebabCase(key)}`, value]
        }) as Entries<ThemeCSSVars>,
    ) as ThemeCSSVars
}

function parseSingleTheme(theme: Partial<MediaTheme> | string): Partial<MediaTheme> {
    return typeof theme === 'string' && Object.prototype.hasOwnProperty.call(themes, theme)
        ? themes[theme]
        : typeof theme === 'object'
        ? Object.fromEntries(
              Object.entries(theme).filter(
                  ([, v]) =>
                      // Removed because caused a circular dependency
                      //   (Object.prototype.hasOwnProperty.call(base, k) ||
                      //       Object.prototype.hasOwnProperty.call(controls, k)) &&
                      typeof v === 'string',
              ),
          )
        : {}
}

export function parseTheme(theme: Partial<MediaTheme> | string | (Partial<MediaTheme> | string)[]): MediaTheme {
    const baseTheme = base
    const parsedTheme = Array.isArray(theme) ? theme : [theme]

    return parsedTheme.reduce((acc: MediaTheme, t) => ({ ...acc, ...parseSingleTheme(t) }), baseTheme)
}

export function useMediaThemeFactory(initial: Partial<MediaTheme> | string): MediaTheme {
    const [theme, setTheme] = useState<MediaTheme>(parseTheme(initial))

    useEffect(() => {
        setTheme(parseTheme(initial))
    }, [JSON.stringify(initial)])

    return theme
}
