import { useContext } from 'react'
import { ClientsContext } from 'src/context/ClientsContext'

export const useClients = () => useContext(ClientsContext)
