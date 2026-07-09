import { createContext, useContext, useEffect, useState } from 'react'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    let s = null
    let cancelled = false
    import('socket.io-client').then(({ io }) => {
      if (cancelled) return
      s = io(window.location.origin, { transports: ['websocket', 'polling'] })
      s.on('connect', () => { setConnected(true) })
      s.on('disconnect', () => { setConnected(false) })
      setSocket(s)
    })
    return () => { cancelled = true; if (s) s.disconnect() }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
