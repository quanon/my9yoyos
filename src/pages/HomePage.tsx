import { useState, useCallback, useEffect } from 'react'
import YoyoGrid from '../components/YoyoGrid'

const SLOT_COUNT = 9

export default function HomePage() {
  const [slots, setSlots] = useState<(string | null)[]>(Array(SLOT_COUNT).fill(null))

  // revoke old object URLs to avoid memory leaks
  const handleImageSelect = useCallback((index: number, file: File) => {
    const url = URL.createObjectURL(file)
    setSlots((prev) => {
      const next = [...prev]
      if (next[index]) URL.revokeObjectURL(next[index]!)
      next[index] = url
      return next
    })
  }, [])

  const handleRemove = useCallback((index: number) => {
    setSlots((prev) => {
      const next = [...prev]
      if (next[index]) URL.revokeObjectURL(next[index]!)
      next[index] = null
      return next
    })
  }, [])

  // cleanup all object URLs on unmount
  useEffect(() => {
    return () => { slots.forEach((url) => url && URL.revokeObjectURL(url)) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filledCount = slots.filter(Boolean).length

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center px-4 py-8 gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">私を構成する 9 つのヨーヨー</h1>
        <p className="text-base-content/60 mt-2">大好きなヨーヨーをみんなにシェアしよう 🪀</p>
      </div>

      <YoyoGrid slots={slots} onImageSelect={handleImageSelect} onRemove={handleRemove} />

      <div className="btm-nav-label">
        <span className="badge badge-lg badge-neutral">
          {filledCount} of {SLOT_COUNT} Selected
        </span>
      </div>
    </div>
  )
}
