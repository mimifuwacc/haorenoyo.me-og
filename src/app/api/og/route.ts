import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import React from "react";
import fs from "fs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const host = decodeURIComponent(searchParams.get("host") ?? "");
    const title = host.replace(/\.haorenoyo\.me$/, "");

    const sourceCodeProFont = fs.readFileSync(
      "src/font/SourceCodePro-Bold.ttf"
    );
    const notoSansJpFont = fs.readFileSync("src/font/NotoSansJP-Bold.ttf");

    return new ImageResponse(
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            color: "#000",
            lineHeight: "1.2",
            fontWeight: "bold",
          },
        },
        React.createElement(
          "p",
          {
            style: {
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              maxWidth: "1100px",
              wordBreak: "break-word",
              whiteSpace: "pre-line",
              margin: "0 auto",
              fontSize: "80px",
            },
          },
          React.createElement(
            "span",
            {
              style: {
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
              style: title && {
                color: "#888",
                fontSize: "48px",
              },
            },
            `${title && "."}haorenoyo.me`
          )
        )
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Source Code Pro",
            data: sourceCodeProFont,
            weight: 400,
            style: "normal",
          },
          {
            name: "Noto Sans JP",
            data: notoSansJpFont,
            weight: 400,
            style: "normal",
          },
        ],
      }
    );
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
