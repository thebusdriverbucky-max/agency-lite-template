import Link from "next/link";

export default function LicenseRequiredPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">License Required</h1>
          <p className="text-zinc-400 text-lg">
            This website requires a valid license key to operate.
            If you are the site owner, please configure your license key in the environment variables.
          </p>
        </div>
        <div className="pt-4 border-t border-zinc-800">
          <Link
            href="https://www.ownyourwebsite.app/"
            target="_blank"
            className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50"
          >
            Get a License
          </Link>
        </div>
      </div>
    </div>
  );
}
