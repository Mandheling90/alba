import { useContext } from 'react'
import { UserContext } from 'src/context/UserContext'

export const useUser = () => useContext(UserContext)
