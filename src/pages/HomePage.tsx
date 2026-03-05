import { useState, useCallback, useRef } from 'react'
import { toBlob } from 'html-to-image'
import YoyoGrid from '../components/YoyoGrid'

const SLOT_COUNT = 9

// Convert a File to a base64 data URL so html-to-image can render it
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function HomePage() {
  const [slots, setSlots] = useState<(string | null)[]>(Array(SLOT_COUNT).fill(null))
  const gridRef = useRef<HTMLDivElement>(null)

  const handleImageSelect = useCallback(async (index: number, file: File) => {
    const dataUrl = await fileToDataUrl(file)
    setSlots((prev) => {
      const next = [...prev]
      next[index] = dataUrl
      return next
    })
  }, [])

  const handleRemove = useCallback((index: number) => {
    setSlots((prev) => {
      const next = [...prev]
      next[index] = null
      return next
    })
  }, [])

  const handleShare = useCallback(async () => {
    if (!gridRef.current) return
    const blob = await toBlob(gridRef.current, { pixelRatio: 2 })
    if (!blob) return

    const file = new File([blob], 'my9yoyos.png', { type: 'image/png' })

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file] })
    } else {
      // fallback: download
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'my9yoyos.png'
      a.click()
      URL.revokeObjectURL(url)
    }
  }, [])

  const filledCount = slots.filter(Boolean).length

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center px-4 py-8 gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">私を構成する 9 つのヨーヨー</h1>
        <p className="text-base-content/60 mt-2">大好きなヨーヨーをみんなにシェアしよう 🪀</p>
      </div>

      <YoyoGrid ref={gridRef} slots={slots} onImageSelect={handleImageSelect} onRemove={handleRemove} />

      <div>
        <span className="badge badge-lg badge-neutral">
          {filledCount} of {SLOT_COUNT} Selected
        </span>
      </div>

      <button
        className="btn btn-primary btn-wide"
        disabled={filledCount === 0}
        onClick={handleShare}
      >
        共有
      </button>
    </div>
  )
}
