# Backend Implementation Guide (Simplified)

## API Endpoint

Create this single endpoint on your Next.js backend:

```
GET /api/v1/versions/{currentVersion}/check-update
```

## Implementation

### File: `api/versions/[currentVersion]/check-update/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import semver from 'semver'

export async function GET(
  request: NextRequest,
  { params }: { params: { currentVersion: string } }
) {
  try {
    const { currentVersion } = params

    // Validate version format
    if (!semver.valid(currentVersion)) {
      return NextResponse.json(
        { error: 'Invalid version format. Must be semantic version (e.g., 1.0.9)' },
        { status: 400 }
      )
    }

    // Get minimum version from environment variable
    const minimumVersion = process.env.MINIMUM_APP_VERSION || '1.0.0'

    // Check if update is required
    const updateRequired = semver.lt(currentVersion, minimumVersion)

    // Optional: Release notes (only shown when updateRequired is true)
    const releaseNotes = updateRequired
      ? process.env.RELEASE_NOTES || 'Please update to the latest version.'
      : undefined

    // Optional: Log for analytics
    const platform = request.headers.get('X-Platform') // 'ios' or 'android'
    console.log(`Version check: platform=${platform}, current=${currentVersion}, minimum=${minimumVersion}, blocked=${updateRequired}`)

    // Return response
    return NextResponse.json({
      minimumVersion,
      updateRequired,
      releaseNotes,
    })
  } catch (error) {
    console.error('Version check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Environment Variables

### Add to Vercel Dashboard

Go to **Settings → Environment Variables** and add:

| Variable | Initial Value | Description |
|----------|---------------|-------------|
| `MINIMUM_APP_VERSION` | `1.0.0` | Versions below this are blocked |
| `RELEASE_NOTES` | `Please update to continue.` | Message shown to blocked users (optional) |

## How It Works

### Simple Logic:
```
if (userVersion < MINIMUM_APP_VERSION) {
  → User is BLOCKED
} else {
  → User can use the app
}
```

### Examples:

**Scenario 1**: `MINIMUM_APP_VERSION=1.0.0`
- User on `1.0.7` → ✅ Can use app
- User on `1.0.9` → ✅ Can use app
- User on `1.1.0` → ✅ Can use app

**Scenario 2**: `MINIMUM_APP_VERSION=1.0.8`
- User on `1.0.7` → ❌ **BLOCKED**
- User on `1.0.8` → ✅ Can use app
- User on `1.0.9` → ✅ Can use app

**Scenario 3**: `MINIMUM_APP_VERSION=2.0.0`
- User on `1.0.9` → ❌ **BLOCKED**
- User on `1.9.9` → ❌ **BLOCKED**
- User on `2.0.0` → ✅ Can use app

## Complete Workflow

### Normal Release (No Force Update)

```bash
# 1. Update app version
app.json: "version": "1.0.10"

# 2. Build and submit
bun build:ios
bun submit:ios
bun submit:android

# 3. Don't touch backend
# Old versions (1.0.9, 1.0.8, etc.) still work fine
```

### Critical Update (Force Users to Update)

```bash
# 1. Release critical fix
app.json: "version": "1.0.11"

# 2. Build and submit
bun build:ios
bun submit:ios
bun submit:android

# 3. After store approval, update Vercel
MINIMUM_APP_VERSION=1.0.11
RELEASE_NOTES="Critical security update required."

# Result: Users on <1.0.11 are blocked
```

## API Response Examples

### User is up to date
```bash
GET /api/v1/versions/1.0.9/check-update
```
Response:
```json
{
  "minimumVersion": "1.0.0",
  "updateRequired": false
}
```

### User is blocked
```bash
GET /api/v1/versions/1.0.7/check-update
```
Response (when `MINIMUM_APP_VERSION=1.0.8`):
```json
{
  "minimumVersion": "1.0.8",
  "updateRequired": true,
  "releaseNotes": "Critical security update required."
}
```

## Testing

### Test with cURL
```bash
# Test current version
curl https://my-way-web.vercel.app/api/v1/versions/1.0.9/check-update

# Test old version
curl https://my-way-web.vercel.app/api/v1/versions/1.0.5/check-update
```

### Test in App
1. Set `MINIMUM_APP_VERSION=9.9.9` in Vercel
2. Launch app
3. You'll see the blocker screen immediately
4. Reset to `MINIMUM_APP_VERSION=1.0.0`

## Install Dependencies

In your backend project:
```bash
npm install semver
npm install -D @types/semver
```

## Summary

✅ **Single environment variable**: `MINIMUM_APP_VERSION`
✅ **Simple logic**: Below minimum = blocked
✅ **Update via Vercel dashboard**: No redeployment needed
✅ **Proper semver comparison**: `1.0.9` < `1.0.10` works correctly
✅ **Graceful error handling**: If API fails, users can still use the app

## Key Takeaway

You only touch the backend when you want to **force users to update**. Otherwise, just release new app versions and users will update naturally.
