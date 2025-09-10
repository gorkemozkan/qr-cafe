import { ImageResponse } from "next/og";
import { publicMenuRepository } from "@/lib/repositories/public-menu-repository";

export const alt = "Cafe Menu";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

interface Params {
  params: Promise<{ slug: string }>;
}

export default async function Image(props: Params) {
  const { slug } = await props.params;

  const menu = await publicMenuRepository.getMenuBySlug(slug);

  return new ImageResponse(
    <div
      style={{
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {menu.cafe.logo_url ? (
        <img
          src={menu.cafe.logo_url}
          alt={menu.cafe.name}
          style={{
            height: "300px",
            display: "block",
            objectFit: "cover",
          }}
        />
      ) : (
        <h1 style={{ fontSize: "128px", fontWeight: "bold", color: "black" }}>{menu.cafe.name}</h1>
      )}
    </div>,
    {
      ...size,
    },
  );
}
