/* ┐
   │ File: config.tsx [/src/media/providers/config.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 22:30:44
   │ Modified: May 4th, 2023 - 14:13:26
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React, { createContext } from 'react'

import { configs, useMediaConfigFactory } from '@media/factories/media-config'

import { MediaConfig } from '../types'

export type ConfigProviderProps = React.PropsWithChildren<{
    /**
     * The initial config to use.
     */
    config?: Partial<MediaConfig>
}>

export const ConfigContext = createContext<MediaConfig>(configs.base)

export function ConfigProvider(props: ConfigProviderProps) {
    const { config: initialConfig = {}, children } = props

    const config = useMediaConfigFactory(initialConfig)

    return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
}
