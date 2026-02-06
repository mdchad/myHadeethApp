import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import Constants from 'expo-constants'
import semver from 'semver'
import { apiGet } from '@/app/utils/api'

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

  const currentVersion = Constants.expoConfig?.version || '1.0.0'

  useEffect(() => {
    checkVersion()
  }, [])

  const checkVersion = async () => {
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
    } catch (err) {
      console.error('Version check failed:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      // On error, allow app to continue (fail gracefully)
      setUpdateRequired(false)
    } finally {
      setLoading(false)
    }
  }

  return {
    updateRequired,
    currentVersion,
    minimumVersion,
    releaseNotes,
    loading,
    error,
  }
}
