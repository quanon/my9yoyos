import { useState, useCallback, useRef, useEffect } from 'react'
import { toBlob } from 'html-to-image'
import YoyoGrid from '../components/YoyoGrid'
import ImageCropModal from '../components/ImageCropModal'

const SLOT_COUNT = 9
const STORAGE_KEY = 'my9yoyos-slots'

function loadSlots(): (string | null)[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length === SLOT_COUNT) return parsed
    }
  } catch { /* ignore */ }
  return Array(SLOT_COUNT).fill(null)
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

function downloadBlob(blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'my9yoyos.png'
  a.click()
  URL.revokeObjectURL(url)
}

export default function HomePage() {
  const [slots, setSlots] = useState<(string | null)[]>(loadSlots)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slots))
    } catch (e) {
      console.error('Failed to save slots to localStorage:', e)
    }
  }, [slots])
  const gridRef = useRef<HTMLDivElement>(null)
  const [cropEnabled, setCropEnabled] = useState(true)

  // crop modal state
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [cropTargetIndex, setCropTargetIndex] = useState<number>(0)

  const handleImageSelect = useCallback(async (index: number, file: File) => {
    const dataUrl = await fileToDataUrl(file)
    if (cropEnabled) {
      setCropTargetIndex(index)
      setCropImage(dataUrl)
    } else {
      setSlots((prev) => {
        const next = [...prev]
        next[index] = dataUrl
        return next
      })
    }
  }, [cropEnabled])

  const handleCropConfirm = useCallback((croppedDataUrl: string) => {
    setSlots((prev) => {
      const next = [...prev]
      next[cropTargetIndex] = croppedDataUrl
      return next
    })
    setCropImage(null)
  }, [cropTargetIndex])

  const handleCropCancel = useCallback(() => {
    setCropImage(null)
  }, [])

  const handleRemove = useCallback((index: number) => {
    setSlots((prev) => {
      const next = [...prev]
      next[index] = null
      return next
    })
  }, [])

  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    setSlots((prev) => {
      const next = [...prev]
      const temp = next[fromIndex]
      next[fromIndex] = next[toIndex]
      next[toIndex] = temp
      return next
    })
  }, [])

  const handleShare = useCallback(async () => {
    if (!gridRef.current) return
    // call twice: first pass caches resources, second renders correctly
    const options = {
      pixelRatio: 2,
      skipAutoScale: true,
      filter: (node: HTMLElement) => !node.hasAttribute?.('data-html2image-ignore'),
    }
    await toBlob(gridRef.current, options)
    const blob = await toBlob(gridRef.current, options)
    if (!blob) return

    if (isMobile() && navigator.share && navigator.canShare?.({ files: [new File([blob], 'my9yoyos.png', { type: 'image/png' })] })) {
      await navigator.share({ files: [new File([blob], 'my9yoyos.png', { type: 'image/png' })] })
    } else {
      downloadBlob(blob)
    }
  }, [])

  const filledCount = slots.filter(Boolean).length
  const mobile = isMobile()

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center px-4 py-8 gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">私を構成する 9 つのヨーヨー</h1>
        <p className="text-sm text-base-content/60 mt-2">大好きなヨーヨーをみんなにシェアしよう 🪀</p>
      </div>

      <YoyoGrid ref={gridRef} slots={slots} onImageSelect={handleImageSelect} onRemove={handleRemove} onReorder={handleReorder} />

      <label className="label cursor-pointer gap-2">
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={cropEnabled}
          onChange={(e) => setCropEnabled(e.target.checked)}
        />
        <span className="label-text text-xs">画像を切り抜く</span>
      </label>

      <button
        className="btn btn-primary btn-wide"
        disabled={filledCount === 0}
        onClick={handleShare}
      >
        {mobile ? '共有' : '画像を保存'}
      </button>

      <a
        className="text-center text-sm text-base-content/60 hover:text-primary"
        href={`https://x.com/search?q=${encodeURIComponent('#私を構成する9つのヨーヨー')}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        #私を構成する9つのヨーヨー
      </a>

      {cropImage && (
        <ImageCropModal
          imageSrc={cropImage}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  )
}
