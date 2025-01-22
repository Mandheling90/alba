import { useContext } from 'react'
import { SocketDataContext } from 'src/context/SocketDataContext'

export const useSocketData = () => useContext(SocketDataContext)
