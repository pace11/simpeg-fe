import { HookSwr } from '@/lib/hooks/HookSwr'
import { createContext } from 'react'

export const ProfileContext = createContext({})

export function ProfileContextProvider({ children, ...props }) {
  const { data: userDetail } = HookSwr({
    path: '/user/me',
  })

  return (
    <ProfileContext.Provider value={userDetail?.data} {...props}>
      {children}
    </ProfileContext.Provider>
  )
}
