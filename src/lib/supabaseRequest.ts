export async function withTimeout<T>(
  promise: Promise<T>,
  timeout = 10000
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timeout")), timeout)
  );

  return Promise.race([promise, timeoutPromise]);
}