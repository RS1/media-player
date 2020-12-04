/*
 * *****************************************************************************
 * File: flash.js (/src/components/flash.js) | @rs1/media-player-pages
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Wednesday, 11th November 2020 9:30:27 am
 *
 * Copyright (c) 2020 RS1 Project
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Friday, 4th December 2020 11:56:03 am
 * *****************************************************************************
 */
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default ({ size = 100, icon: _icon = false, onEnd = () => {} }) => {
    const [icon, setIcon] = useState(false)
    const hide = useRef()

    const entry = { opacity: 0, scale: 0 }
    const normal = { opacity: 1, scale: 1 }
    const exit = { opacity: 0, scale: 2 }

    useEffect(() => {
        if (!_icon) return
        setIcon(_icon)
        if (hide.current) clearTimeout(hide.current)
        setTimeout(() => {
            setIcon(false)
            onEnd(false)
        }, 300)
    }, [_icon])

    return (
        <Container size={size}>
            <AnimatePresence>
                {icon && (
                    <Flash initial={entry} animate={normal} exit={exit}>
                        <FontAwesomeIcon icon={icon} />
                    </Flash>
                )}
            </AnimatePresence>
        </Container>
    )
}

const Container = styled.div`
    position: absolute;
    top: 0;
    width: 100%;
    height: ${props => (props.size ? `${props.size}px` : '100%')};
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    touch-events: none;
`

const Flash = styled(motion.div)`
    border-radius: 50%;
    color: #ffffff;
    background: rgba(25, 25, 25, 0.75);
    font-size: 28px;
    width: 60px;
    height: 60px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    touch-events: none;
`
