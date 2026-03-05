import YoyoSlot from './YoyoSlot'

type Props = {
  slots: (string | null)[]
  onImageSelect: (index: number, file: File) => void
  onRemove: (index: number) => void
}

export default function YoyoGrid({ slots, onImageSelect, onRemove }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
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
}
