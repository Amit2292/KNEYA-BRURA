export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">טוען...</p>
      </div>
    </div>
  )
}
