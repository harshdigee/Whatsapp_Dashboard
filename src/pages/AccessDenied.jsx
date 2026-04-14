export default function AccessDenied({ email, onSignOut }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-slate-50">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">Access Denied</h1>
          <p className="text-sm text-slate-400">
            This account is not authorized to use this dashboard.
          </p>
        </div>

        {email && (
          <p className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
            <span className="text-slate-500">Signed in as </span>
            {email}
          </p>
        )}

        <button
          type="button"
          onClick={onSignOut}
          className="w-full rounded-2xl border border-slate-600 bg-transparent px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
        >
          Sign out and try another account
        </button>
      </div>
    </div>
  )
}
