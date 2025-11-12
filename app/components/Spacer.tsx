import { MotiView } from 'moti'
import React from 'react'

interface SpacerProps {
  height?: number;
}

const Spacer: React.FC<SpacerProps> = ({ height = 16 }) => <MotiView style={{ height }} />

export default Spacer
