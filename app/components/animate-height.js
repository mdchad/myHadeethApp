import '@motify/core'
import '@motify/components'

import React from 'react'
import { MotiView, TransitionConfig, useDynamicAnimation } from 'moti'
import { StyleSheet, Platform } from 'react-native'
import { useDerivedValue, useSharedValue } from 'react-native-reanimated'
import { View } from 'react-native'

function AnimateHeight({
  children,
  hide = false,
  style,
  delay = Platform.select({ web: 250, default: 0 }),
  transition = { type: 'timing', delay },
  enterFrom = 'top',
  onHeightDidAnimate,
  initialHeight = 0,
  ...motiViewProps
}) {
  const measuredHeight = useSharedValue(initialHeight)
  const state = useDynamicAnimation(() => {
    return {
      height: initialHeight,
      opacity: !initialHeight || hide ? 0 : 1
    }
  })
  if ('state' in motiViewProps) {
    console.warn('[AnimateHeight] state prop not supported')
  }

  const animation = useDerivedValue(() => {
    let height = Math.ceil(measuredHeight.value)
    if (hide) {
      height = 0
    }

    const notVisible = !height || hide

    state.animateTo({
      height,
      opacity: !height || hide ? 0 : 1
    })
  }, [hide, measuredHeight])

  return (
    <MotiView
      {...motiViewProps}
      state={state}
      transition={transition}
      onDidAnimate={
        onHeightDidAnimate &&
        ((key, finished, _, { attemptedValue }) =>
          key == 'height' && onHeightDidAnimate(attemptedValue))
      }
      style={[styles.hidden, style]}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.autoBottom

          // THIS BREAKS IDK WHY, so ignore that prop
          // enterFrom === 'top' ? styles.autoBottom : styles.autoTop,
        ]}
        onLayout={({ nativeEvent }) => {
          measuredHeight.value = nativeEvent.layout.height
        }}
      >
        {children}
      </View>
    </MotiView>
  )
}

const styles = StyleSheet.create({
  autoBottom: {
    bottom: 'auto'
  },
  autoTop: {
    top: 'auto'
  },
  hidden: {
    overflow: 'hidden'
  }
})

export { AnimateHeight }
