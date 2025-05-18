import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.10.1.7:8304";

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  try {
    // Get the path and search params
    const url = new URL(request.url);
    const path = url.pathname.replace("/api/proxy", "");
    const searchParams = url.search;

    // Construct backend URL
    const backendUrl = `${BASE_URL}${path}${searchParams}`;

    // Forward the request
    const response = await fetch(backendUrl, {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers),
        host: undefined as any, // Remove host header
      },
      body: request.method !== "GET" ? await request.text() : undefined,
    });

    // Get response data
    const data = response.headers.get("content-type")?.includes("application/json")
      ? await response.json()
      : await response.text();

    // Return response
    return NextResponse.json(data, {
      status: response.status,
      headers: Object.fromEntries(response.headers),
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to proxy request to backend service" },
      { status: 500 }
    );
  }
}