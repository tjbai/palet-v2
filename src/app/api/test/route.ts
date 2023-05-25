import { NextRequest, NextResponse } from "next/server";
import querystring from "querystring";

export async function POST(request: NextRequest) {
  const { path } = await request.json();
  return NextResponse.json({ res: querystring.escape(path) });
}
