import { forwardRef } from 'react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import YoyoSlot from './YoyoSlot'

type Props = {
  slots: (string | null)[]
  onImageSelect: (index: number, file: File) => void
  onRemove: (index: number) => void
  onReorder: (fromIndex: number, toIndex: number) => void
}

// Slot indices are fixed IDs 0-8
const SLOT_IDS = [0, 1, 2, 3, 4, 5, 6, 7, 8]

export default forwardRef<HTMLDivElement, Props>(function YoyoGrid(
  { slots, onImageSelect, onRemove, onReorder },
  ref
) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Long-press (250ms) activates drag; small jitter (5px) is tolerated
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      onReorder(Number(active.id), Number(over.id))
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={SLOT_IDS} strategy={rectSortingStrategy}>
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
      </SortableContext>
    </DndContext>
  )
})
