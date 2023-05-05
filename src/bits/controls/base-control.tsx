/* ┐
   │ File: base-control.tsx [/src/bits/controls/base-control.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 21st, 2023 - 22:22:25
   │ Modified: May 4th, 2023 - 16:41:10
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { CustomControlProps } from './types'

/**
 * Props for the BaseControl component.
 * We don't actually use any of CustomControlProps, but it's here for future use.
 */
type Props = {
    Component: React.ComponentType<CustomControlProps>
}

/**
 * This is a wrapper around custom controls that can be passed to the media player.\
 * It's not meant to be used externally.
 * @private
 */
function BaseControl(props: Props) {
    const { Component } = props

    return <Component />
}

export default React.memo(BaseControl)
