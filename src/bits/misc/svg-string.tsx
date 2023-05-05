/* ┐
   │ File: svg-string.tsx [/src/bits/misc/svg-string.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 21st, 2023 - 16:47:02
   │ Modified: April 27th, 2023 - 12:22:32
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { extractSVG } from '@utils/svg'

type Props = {
    className?: string
    svg: string
} & React.SVGProps<SVGSVGElement>

function SvgString(props: Props) {
    const { className, svg, ...rest } = props

    const { width, height, paths } = extractSVG(svg)

    return (
        <svg className={className} viewBox={`0 0 ${width} ${height}`} {...rest}>
            {paths.map((path, i) => (
                <path key={i} d={path} fill='currentColor' />
            ))}
        </svg>
    )
}

export default SvgString
