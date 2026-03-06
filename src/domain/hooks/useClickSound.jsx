import { useContext } from 'react'
import { AudioContext } from '@/shared/context'

const useClickSound = () => useContext(AudioContext)
export default useClickSound
