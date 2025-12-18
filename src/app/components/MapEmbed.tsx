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

  // Build a “Directions” link that opens Google Maps
  const directionsLink = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        query || ""
      )}`;

  return (
    <div className="w-full">
      <div
        style={{ width, height }}
        className="rounded-2xl overflow-hidden shadow-2xl"
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

      <div className="mt-4 text-center">
        <a
          href={directionsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 hover:border-yellow-500 text-gray-700 hover:text-yellow-500 font-semibold rounded-lg transition-all duration-300"
        >
          Get Directions
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default MapEmbed;
