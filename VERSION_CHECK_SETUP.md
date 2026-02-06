# Version Check Setup - Quick Reference

## Overview

The app now includes a version check system that blocks users on outdated versions. It's controlled by a single environment variable: `MINIMUM_APP_VERSION`.

## How It Works

1. App sends version on startup: `GET /api/v1/versions/1.0.9/check-update`
2. Backend responds with minimum required version
3. If user's version < minimum → Full-screen blocker shown
4. User clicks "Update Now" → Redirected to App Store/Play Store

## Backend Setup

See `BACKEND_IMPLEMENTATION.md` for full details.

**Quick version:**
1. Create endpoint: `app/api/v1/versions/[currentVersion]/check-update/route.ts`
2. Add environment variable in Vercel: `MINIMUM_APP_VERSION=1.0.0`
3. Done!

## When to Update Backend

### Normal Release (No Action Needed)
```bash
Release v1.0.10 → Don't touch backend
Old versions still work
```

### Critical Update (Force Update)
```bash
Release v1.0.11 → Set MINIMUM_APP_VERSION=1.0.11
Users on <1.0.11 are blocked
```

## App Store URLs

Update these in `app/components/update-required-blocker.tsx` if needed:
- **iOS**: `https://apps.apple.com/app/id6478639621`
- **Android**: `https://play.google.com/store/apps/details?id=com.mdchad.myWay`

## Testing

1. Set `MINIMUM_APP_VERSION=9.9.9` in Vercel
2. Launch app → See blocker screen
3. Reset to `MINIMUM_APP_VERSION=1.0.0`

## Files Modified

- `app/shared/useVersionCheck.ts` - Version check logic
- `app/components/update-required-blocker.tsx` - Blocker UI
- `app/_layout.tsx` - Integration
- `app/utils/api.ts` - User-Agent with version
- `app/i18n/locales/*.json` - Translations

## Key Takeaway

**You only need one environment variable**: `MINIMUM_APP_VERSION`

Set it higher than users' current versions to force them to update.
