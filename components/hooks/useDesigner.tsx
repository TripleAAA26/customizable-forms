'use client'

import { useContext } from 'react'
import { DesignerContext } from '@/components/DesignerContext'

export default function useDesigner() {
    const context = useContext(DesignerContext)

    if (!context) {
        throw new Error('useDesigner() must be used within DesignerContext')
    }

    return context
}

