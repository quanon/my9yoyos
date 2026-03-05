import { useState, useCallback } from 'react'
import Cropper, { type Area } from 'react-easy-crop'

type Props = {
  imageSrc: string
  onConfirm: (croppedDataUrl: string) => void
  onCancel: () => void
}

// Extract the cropped area from the image using canvas
function getCroppedImage(imageSrc: string, crop: Area): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = crop.width
      canvas.height = crop.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas context unavailable'))
      ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)
      resolve(canvas.toDataURL('image/png'))
    }
    image.onerror = reject
    image.src = imageSrc
  })
}

export default function ImageCropModal({ imageSrc, onConfirm, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const handleConfirm = useCallback(async () => {
    if (!croppedAreaPixels) return
    const cropped = await getCroppedImage(imageSrc, croppedAreaPixels)
    onConfirm(cropped)
  }, [imageSrc, croppedAreaPixels, onConfirm])

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-sm p-4 flex flex-col gap-4">
        <h3 className="font-bold text-lg">画像を切り抜く</h3>

        <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="range range-sm range-primary"
        />

        <div className="modal-action mt-0">
          <button className="btn btn-ghost" onClick={onCancel}>キャンセル</button>
          <button className="btn btn-primary" onClick={handleConfirm}>OK</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onCancel}>close</button>
      </form>
    </dialog>
  )
}
