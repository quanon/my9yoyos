import { forwardRef } from 'react'
import YoyoSlot from './YoyoSlot'

type Props = {
  slots: (string | null)[]
  onImageSelect: (index: number, file: File) => void
  onRemove: (index: number) => void
}

export default forwardRef<HTMLDivElement, Props>(function YoyoGrid({ slots, onImageSelect, onRemove }, ref) {
  return (
    <div ref={ref} className="grid grid-cols-3 gap-2 w-full max-w-sm bg-base-100 rounded-xl p-3">
      {slots.map((imageUrl, i) => (
        <YoyoSlot
          key={i}
          index={i}
          imageUrl={imageUrl}
          onImageSelect={onImageSelect}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
})
