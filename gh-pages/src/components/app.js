/*
 * *****************************************************************************
 * File: app.js (/src/components/app.js) | @rs1/media-player-pages
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Monday, 9th November 2020 6:24:53 pm
 *
 * Copyright (c) 2020-2022 Andrea Corsini T/A RS1 Project - All rights reserved.
 * License: Apache License 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified on Thursday, 21st July 2022 10:16:59 am
 * *****************************************************************************
 */

import React, { useMemo, useState } from 'react'
import styled from '@emotion/styled'

import './app.css'

import Player from '@rs1/media-player'

const tracks = [
    {
        title: 'Prelude',
        artist: 'Jan Morgenstern',
        album: 'Big Buck Bunny',
        position: '01',
        side: 'A',
        src:
            'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Jan_Morgenstern/Big_Buck_Bunny/Jan_Morgenstern_-_01_-_Prelude.mp3',
        video: false,
        poster:
            'https://i1.sndcdn.com/artworks-000005011281-9brqv2-t500x500.jpg',
    },
    {
        title: 'Shock and Gnaw',
        artist: 'Jan Morgenstern',
        album: 'Big Buck Bunny',
        position: '02',
        side: 'A',
        src:
            'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Jan_Morgenstern/Big_Buck_Bunny/Jan_Morgenstern_-_03_-_Shock_and_Gnaw.mp3',
        video: false,
        poster:
            'https://i1.sndcdn.com/artworks-000005011281-9brqv2-t500x500.jpg',
    },
    {
        title: 'High as a Kite / End Crabbits',
        artist: 'Jan Morgenstern',
        album: 'Big Buck Bunny',
        position: '03',
        side: 'A',
        src:
            'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Jan_Morgenstern/Big_Buck_Bunny/Jan_Morgenstern_-_07_-_High_as_a_Kite__End_Crabbits.mp3',
        video: false,
        poster:
            'https://i1.sndcdn.com/artworks-000005011281-9brqv2-t500x500.jpg',
    },
    {
        title: 'Big Buck Bunny',
        artist: 'Sacha Goedegebure / Blender Foundation',
        position: '01',
        side: 'B',
        src:
            'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        video: true,
        poster:
            'https://i1.sndcdn.com/artworks-000005011281-9brqv2-t500x500.jpg',
    },
]

export default () => {
    const [track, setTrack] = useState(0)

    const [state, setState] = useState({
        canMute: true,
        canFullScreen: true,
        isPlaylist: true,
        loop: false,
        vinylMode: true,
        autoResize: true,
        playerWidth: 512,
        playerHeight: 512,
        controlsColor: '#f7f7f7',
        metadataOnMediaColor: '#f7f7f7',
        accentColor: '#f0cd41',
        loaderColor: '#f7f7f7',
        errorColor: '#ed4337',
        fontFamily: 'Helvetica Neue',
        timeFontFamily: `'Nicolatte', monospace`,
        mediaBackground: '#000000',
        vinylBackground: '#171717',
        playerBackground: '#171717',
    })

    const config = useMemo(
        () => ({
            options: {
                vinylMode: state.vinylMode,
                playerSize: [state.playerWidth, state.playerHeight],
                canMute: state.canMute,
                canFullScreen: state.canFullScreen,
                isPlaylist: state.isPlaylist,
                loop: state.loop,
                autoResize: state.autoResize,
            },
            style: {
                controlsColor: state.controlsColor,
                metadataOnMediaColor: state.metadataOnMediaColor,
                accentColor: state.accentColor,
                loaderColor: state.loaderColor,
                errorColor: state.errorColor,
                fontFamily: state.fontFamily,
                timeFontFamily: state.timeFontFamily,
                mediaBackground: state.mediaBackground,
                playerBackground: state.playerBackground,
                vinylBackground: state.vinylBackground,
            },
            actions: {
                onPrevious: () => {
                    setTrack(t => (t === 0 ? tracks.length : t) - 1)
                },
                onNext: () => {
                    setTrack(t => (t === tracks.length - 1 ? 0 : t + 1))
                },
                // onPlayingChanged: playing => console.log(`Playing: ${playing}`),
                // onLoadingChanged: loading => console.log(`Loading: ${loading}`),
                // onSeekingChanged: seeking => console.log(`Seeking: ${seeking}`),
                // onBufferChanged: buffer => console.log(`Buffer: ${buffer}`),
                // onTimeChanged: time => console.log(`Time: ${time}`),
                // onStateChanged: state =>
                //     console.log(`State: ${JSON.stringify(state)}`),
            },
        }),
        [state]
    )

    const options = {
        vinylMode: {
            label: 'Vinyl mode',
            type: 'checkbox',
            value: state.vinylMode,
        },
        canMute: {
            label: 'Mute button',
            type: 'checkbox',
            value: state.canMute,
        },
        canFullScreen: {
            label: 'Full screen button',
            type: 'checkbox',
            value: state.canFullScreen,
        },
        isPlaylist: {
            label: 'Enable playlist controls',
            type: 'checkbox',
            value: state.isPlaylist,
        },
        loop: {
            label: 'Loop single media',
            type: 'checkbox',
            value: state.loop,
        },
        autoResize: {
            label: 'Auto resize player to fit content',
            type: 'checkbox',
            value: state.autoResize,
        },
        playerWidth: {
            label: 'Player width',
            type: 'text',
            value: state.playerWidth,
        },
        playerHeight: {
            label: 'Player height',
            type: 'text',
            value: state.playerHeight,
        },
        controlsColor: {
            label: 'Icons / text color for controls',
            type: 'text',
            value: state.controlsColor,
        },
        metadataOnMediaColor: {
            label: 'Color of text on media',
            type: 'text',
            value: state.metadataOnMediaColor,
        },
        accentColor: {
            label: 'Active icon color',
            type: 'text',
            value: state.accentColor,
        },
        loaderColor: {
            label: 'Loading text color',
            type: 'text',
            value: state.loaderColor,
        },
        errorColor: {
            label: 'Error text color',
            type: 'text',
            value: state.errorColor,
        },
        fontFamily: {
            label: 'Font Family',
            type: 'text',
            value: state.fontFamily,
        },
        timeFontFamily: {
            label: 'Time Font Family',
            type: 'text',
            value: state.timeFontFamily,
        },
        mediaBackground: {
            label: 'Video Player Background',
            type: 'text',
            value: state.mediaBackground,
        },
        playerBackground: {
            label: 'Audio Player Background',
            type: 'text',
            value: state.playerBackground,
        },
        vinylBackground: {
            label: 'Vinyl Player Background',
            type: 'text',
            value: state.vinylBackground,
        },
    }

    const handleChange = e => {
        setState(state => ({
            ...state,
            [e.target.name]:
                options[e.target.name].type === 'checkbox'
                    ? e.target.checked
                    : e.target.value,
        }))
    }

    return (
        <Container>
            <Title>@rs1/media-player</Title>
            <Wrapper>
                <Sidebar>
                    <Subtitle>Options</Subtitle>
                    {Object.entries(options).map(([key, option]) => (
                        <Option key={key}>
                            {option.type === 'checkbox' && (
                                <>
                                    <input
                                        id={`option_${key}`}
                                        type='checkbox'
                                        name={key}
                                        onChange={handleChange}
                                        checked={option.value}
                                    />
                                    <label htmlFor={`option_${key}`}>
                                        {option.label}
                                    </label>
                                </>
                            )}
                            {['number', 'text'].includes(option.type) && (
                                <>
                                    <label htmlFor={`option_${key}`}>
                                        {option.label}
                                    </label>
                                    <br />
                                    <input
                                        id={`option_${key}`}
                                        type={option.type}
                                        name={key}
                                        onChange={handleChange}
                                        value={option.value}
                                        placeholder={option.label}
                                    />
                                </>
                            )}
                        </Option>
                    ))}
                </Sidebar>
                <Content isVideo={tracks[track].video}>
                    <Player media={tracks[track]} config={config} />
                </Content>
            </Wrapper>
        </Container>
    )
}

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr;
    max-height: 100vh;
    overflow: hidden;
`

const Title = styled.h1`
    font-size: 25px;
    margin: 15px 0 0 0;
    width: 100%;
    text-align: center;
    flex: 1;
    color: #f7f7f7;
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    padding: 15px;
    box-sizing: border-box;
    flex: 999;
    overflow: hidden;
`

const Sidebar = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    box-sizing: border-box;
    margin-right: 15px;
    background: #373737;
    padding: 5px 10px;
    border-radius: 10px;
    align-items: flex-start;
    justify-content: flex-start;
    overflow-y: auto;
    max-height: 100%;
    color: #f7f7f7;
`

const Subtitle = styled.h3`
    font-size: 17px;
    margin: 10px 0;
    width: 100%;
    text-align: center;
`

const Option = styled.div`
    padding: 5px 0;
    border-bottom: 1px solid #666666;
    &:last-of-type {
        border-bottom: 0;
    }
    & input[type='checkbox'] {
        margin-right: 5px;
    }
    & input[type='text'],
    input[type='number'] {
        margin-top: 5px;
    }
`

const Content = styled.div`
    width: 70%;
    position: relative;
    box-sizing: border-box;

    flex-shrink: 1;
    align-items: center;
    justify-content: center;
    min-width: 0;
    overflow: hidden;
    border-radius: 8px;
`
