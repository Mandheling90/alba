import { useContext } from 'react'
import { ModalContext } from 'src/context/ModalContext'
import { CustomModalContext } from 'src/context/CustomModalContext'

export const useModal = () => useContext(ModalContext)
export const useCustomModal = () => useContext(CustomModalContext)
