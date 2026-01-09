import React from "react";

type MapEmbedProps = {
  // Use EITHER lat+lng OR a text address/query
  lat?: number;
  lng?: number;
  query?: string;
  address?: string;
  zoom?: number;
  width?: string | number;
  height?: string | number;
};

const MapEmbed: React.FC<MapEmbedProps> = ({
  lat,
  lng,
  query,
  address,
  zoom = 15,
  width = "100%",
  height = "450px",
}) => {
  const hasCoords = typeof lat === "number" && typeof lng === "number";

  // Build the free embed URL (no API key needed)
  const embedSrc = hasCoords
    ? `https://www.google.com/maps?q=${address}&z=${zoom}&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(
        query || ""
      )}&z=${zoom}&output=embed`;

  
  return (
    <div className="w-full">
      <div
        style={{ width, height }}
        className="overflow-hidden shadow-2xl"
      >
        <iframe
          title="Google Map"
          src={embedSrc}
          width="100%"
          height="100%"
          className="border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};

export default MapEmbed;
