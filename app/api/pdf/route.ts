const PDF_SOURCE_URL =
  "https://volkai-labs.blr1.digitaloceanspaces.com/kufu-hills/VAYU%20HILLS%20(1)_compressed%20(1).pdf";

export async function GET() {
  const response = await fetch(PDF_SOURCE_URL, {
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok || !response.body) {
    return new Response("Failed to load PDF.", { status: 502 });
  }

  const headers = new Headers({
    "Cache-Control": "public, max-age=3600, s-maxage=86400",
    "Content-Disposition": 'inline; filename="vayu-hills.pdf"',
    "Content-Type": response.headers.get("Content-Type") ?? "application/pdf",
  });

  const contentLength = response.headers.get("Content-Length");

  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  return new Response(response.body, { headers });
}
