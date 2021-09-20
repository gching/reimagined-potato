async function fetcher<T>(url: string): Promise<T | null> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("An error occurred while fetching the data.");
  }

  const jsonResponse: { data: T | null } = await res.json();

  return jsonResponse?.data;
}

export default fetcher;
