"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Something went wrong</h2>

      <p className="text-gray-500">
        An unexpected error occurred.
      </p>

      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Try Again
      </button>
    </div>
  );
}