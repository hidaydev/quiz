import { useEffect, useRef, useState } from 'react'
import { logEvent } from '../api/attempts'

export interface AntiCheatCounts {
  tabSwitches: number
  pastes: number
}

export function useAntiCheat(attemptId: number | null): AntiCheatCounts {
  const [tabSwitches, setTabSwitches] = useState(0)
  const [pastes, setPastes] = useState(0)
  const attemptIdRef = useRef(attemptId)
  attemptIdRef.current = attemptId

  useEffect(() => {
    if (!attemptId) return

    const handleVisibility = () => {
      const id = attemptIdRef.current
      if (!id) return
      if (document.hidden) {
        logEvent(id, 'window_blur')
        setTabSwitches((n) => n + 1)
      } else {
        logEvent(id, 'window_focus')
      }
    }

    const handlePaste = () => {
      const id = attemptIdRef.current
      if (!id) return
      logEvent(id, 'copy_paste_detected')
      setPastes((n) => n + 1)
    }

    document.addEventListener('visibilitychange', handleVisibility)
    document.addEventListener('paste', handlePaste)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      document.removeEventListener('paste', handlePaste)
    }
  }, [attemptId])

  return { tabSwitches, pastes }
}
