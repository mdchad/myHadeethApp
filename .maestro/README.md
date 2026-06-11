# E2E smoke flows (Maestro)

Five flows covering the critical paths of the v2 migration. The YAML is
standard Maestro syntax, so it runs with either the official Maestro CLI or
[maestro-runner](https://github.com/devicelab-dev/maestro-runner).

## Prerequisites

- A **development build** of the app installed on a simulator/emulator
  (bundle id `com.mdchad.myWay`). Expo Go will not work: the flows target
  the real bundle id.
- The build's `EXPO_PUBLIC_API_URL` pointing at a reachable backend
  (dev.myway.my, or localhost for the gated flow).
- App default language is Malay (flows assert Malay strings and launch with
  `clearState: true`, which resets any language override).

## Running

```bash
# All smoke flows (01-04). The gated flow is excluded by config.yaml.
maestro-runner test .maestro
# or with the official CLI:
maestro test .maestro

# Single flow
maestro-runner test .maestro/03-search.yaml
```

## Flow 05: update blocker (tag: gated)

Tests the MINIMUM_APP_VERSION kill switch end to end. It needs a backend
that gates the app's version:

```bash
# In myHadeethWeb:
MINIMUM_APP_VERSION=9.9.9 bun run dev

# App build must point at it:
EXPO_PUBLIC_API_URL=http://localhost:3000

# Then:
maestro-runner test --include-tags gated .maestro
```

## Notes

- Selectors are visible-text based (no testIDs exist in the app yet). If UI
  copy changes in `app/i18n/locales/ms.json`, update the matching flow.
- Flow 02/04 tap the first volume via the "→" range arrow on volume rows,
  which is data-independent.
- Search (flow 03) allows up to 30s for a cold semantic-search response.
