export default function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a2e]">
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-[#0f3460] border-t-transparent"
        aria-hidden
      />
    </div>
  )
}
