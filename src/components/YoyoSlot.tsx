import { useRef } from 'react'

type Props = {
  index: number
  imageUrl: string | null
  onImageSelect: (index: number, file: File) => void
  onRemove: (index: number) => void
}

export default function YoyoSlot({ index, imageUrl, onImageSelect, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (!imageUrl) inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onImageSelect(index, file)
    // reset so the same file can be re-selected
    e.target.value = ''
  }

  return (
    <div
      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group bg-base-100 border border-base-300"
      onClick={handleClick}
    >
      {/* slot number badge */}
      <span className="absolute top-1 left-1 z-10 badge badge-sm badge-neutral opacity-80">
        {index + 1}
      </span>

      {imageUrl ? (
        <>
          <img src={imageUrl} alt={`slot ${index + 1}`} className="w-full h-full object-cover" />
          {/* remove button shown on hover */}
          <button
            className="absolute top-1 right-1 z-10 btn btn-xs btn-circle btn-error opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); onRemove(index) }}
            aria-label="削除"
          >
            ✕
          </button>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-base-content/30 text-3xl select-none">
          +
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
