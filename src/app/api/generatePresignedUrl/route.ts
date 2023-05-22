import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { NextRequest, NextResponse } from "next/server";
import querystring from "querystring";

export async function GET() {
  return NextResponse.json({ hello: "Next.js" });
}

interface PresignedUrlRequest {
  audioFilePath: string;
}

// took me way too long to figure this out
export async function POST(request: NextRequest) {
  const data: PresignedUrlRequest = await request.json();
  const { audioFilePath } = data;

  if (!audioFilePath) {
    return NextResponse.json({ error: "Need to pass in file path" });
  }

  // create path
  const encodedAudioFilePath = querystring.escape(audioFilePath);
  const cdnDomain = process.env.NEXT_PUBLIC_CDN_BASE_URL;
  const url = `${cdnDomain}/${encodedAudioFilePath}`;

  // grab keys
  const { privateKeyEncoded } = JSON.parse(
    process.env.CDN_PRIVATE_KEY as string
  );
  const privateKey = Buffer.from(privateKeyEncoded, "base64").toString("utf-8");
  const keyPairId = process.env.CDN_PUBLIC_KEY_ID as string;

  // set expiration date for 2 hours
  const now = new Date();
  const dateLessThan = new Date(
    now.getTime() + 2 * 60 * 60 * 1000
  ).toISOString();

  const signedUrl = getSignedUrl({
    url,
    keyPairId,
    dateLessThan,
    privateKey,
  });

  if (!signedUrl) {
    return NextResponse.json({
      error: "Could not generated signed url for this file path",
    });
  }
  return NextResponse.json({ signedUrl });
}
