import { useContext } from 'react'
import { AudioContext } from './AudioContext'

export const useClickSound = () => useContext(AudioContext)
