import satori from "satori";
import { NextRequest } from "next/server";
import React from "react";

import fs from "fs";
import sharp from "sharp";

export async function GET(req: NextRequest) {
  const fontData = {
    sourceCodePro: fs.readFileSync("src/font/SourceCodePro-Bold.ttf"),
    notoSansJp: fs.readFileSync("src/font/NotoSansJP-Bold.ttf"),
  };

  try {
    const { searchParams } = new URL(req.url);

    const host = decodeURIComponent(searchParams.get("host") ?? "");
    const title = host.replace(/\.haorenoyo\.me$/, "");

    const svg = await satori(
      React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "1200px",
          height: "630px",
          backgroundColor: "#fff",
          color: "#000",
          lineHeight: "1.2",
          fontWeight: "bold",
        },
        children: [
          React.createElement("p", {
            style: {
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              maxWidth: "1100px",
              wordBreak: "break-word",
              whiteSpace: "pre-line",
              margin: "0 auto",
            },
            children: [
              React.createElement(
                "span",
                {
                  style: {
                    fontSize: "80px",
                    wordBreak: "break-word",
                    whiteSpace: "pre-line",
                    maxWidth: "1100px",
                    transform: /[a-zA-Z]/.test(title)
                      ? "translateY(8px)"
                      : "translateY(0)",
                  },
                },
                title
              ),
              React.createElement(
                "span",
                {
                  style: {
                    color: "#888",
                    fontSize: "48px",
                  },
                },
                ".haorenoyo.me"
              ),
            ],
          }),
        ],
      }),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Source Code Pro",
            data: fontData.sourceCodePro,
            weight: 400,
            style: "normal",
          },
          {
            name: "Noto Sans JP",
            data: fontData.notoSansJp,
            weight: 400,
            style: "normal",
          },
        ],
      }
    );

    const png = await sharp(Buffer.from(svg)).png().toBuffer();

    return new Response(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error("OG image generation error:", error);
    return new Response(
      `Failed to generate OG image: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
}
