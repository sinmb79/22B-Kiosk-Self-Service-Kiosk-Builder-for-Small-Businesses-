import { NextResponse } from "next/server";

import { extractMenuFromImage } from "@/lib/ocr/extract-menu";

type RequestPayload = {
  imageUrl?: string;
  imageDataUrl?: string;
  apiKey?: string;
  provider?: "openai" | "anthropic" | "google";
};

export async function POST(request: Request) {
  let payload: RequestPayload;

  try {
    payload = (await request.json()) as RequestPayload;
  } catch {
    return NextResponse.json(
      { message: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  if (!payload.imageUrl?.trim() && !payload.imageDataUrl?.trim()) {
    return NextResponse.json(
      { message: "An image URL or uploaded photo is required." },
      { status: 400 }
    );
  }

  try {
    const result = await extractMenuFromImage(payload);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to extract menu items."
      },
      { status: 500 }
    );
  }
}
