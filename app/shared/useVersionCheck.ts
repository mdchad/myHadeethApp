import { useEffect, useRef, useState } from 'react'
import Constants from 'expo-constants'
import { onlineManager } from '@tanstack/react-query'
import { apiGet, isNetworkError } from '@/app/utils/api'

interface VersionCheckResponse {
  minimumVersion: string
  updateRequired: boolean
  releaseNotes?: string
}

interface VersionCheckResult {
  updateRequired: boolean
  currentVersion: string
  minimumVersion: string | null
  releaseNotes: string | null
  loading: boolean
  error: string | null
}

export function useVersionCheck(): VersionCheckResult {
  const [updateRequired, setUpdateRequired] = useState(false)
  const [minimumVersion, setMinimumVersion] = useState<string | null>(null)
  const [releaseNotes, setReleaseNotes] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Track whether a check has ever succeeded so an offline launch retries the
  // moment connectivity returns — otherwise a user who opened the app with no
  // network would bypass the force-update gate for the whole session.
  const succeededRef = useRef(false)
  const inFlightRef = useRef(false)

  const currentVersion = Constants.expoConfig?.version || '1.0.0'

  const checkVersion = async () => {
    if (inFlightRef.current) return
    inFlightRef.current = true
    try {
      setLoading(true)
      setError(null)

      // Call the version check endpoint using apiGet
      // apiGet already returns parsed JSON, not a Response object
      const data: VersionCheckResponse = await apiGet<VersionCheckResponse>(
        `/api/versions/${currentVersion}/check-update`
      )

      // Update state
      setMinimumVersion(data.minimumVersion)
      setReleaseNotes(data.releaseNotes || null)
      setUpdateRequired(data.updateRequired)
      succeededRef.current = true
    } catch (err) {
      // Offline is expected — warn, don't error, and retry on reconnect.
      if (isNetworkError(err)) {
        console.warn('Version check skipped (offline):', err.message)
      } else {
        console.error('Version check failed:', err)
      }
      setError(err instanceof Error ? err.message : 'Unknown error')
      // On error, allow app to continue (fail gracefully)
      setUpdateRequired(false)
    } finally {
      inFlightRef.current = false
      setLoading(false)
    }
  }

  useEffect(() => {
    checkVersion()

    // onlineManager is fed by NetInfo (see useOnlineManager). When the device
    // comes back online and we never got an answer, run the check again.
    const unsubscribe = onlineManager.subscribe((isOnline) => {
      if (isOnline && !succeededRef.current) {
        checkVersion()
      }
    })

    return unsubscribe
  }, [])

  return {
    updateRequired,
    currentVersion,
    minimumVersion,
    releaseNotes,
    loading,
    error,
  }
}
