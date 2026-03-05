import { useParams } from 'react-router-dom'

export default function SharePage() {
  const { shareId } = useParams()
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center p-4">
      <p>共有ページ: {shareId}</p>
    </div>
  )
}
