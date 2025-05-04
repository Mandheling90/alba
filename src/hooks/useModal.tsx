import { useContext } from 'react'
import { ModalContext } from 'src/context/ModalContext'

export const useModal = () => useContext(ModalContext)
