import { useContext } from 'react'
import { ContentsContext } from 'src/context/ContensContext'

export const useContents = () => useContext(ContentsContext)
