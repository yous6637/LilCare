"use client";

import { useEffect, useRef, useState } from "react";
import { ChildLocationData } from "@/types";
import { supabaseBrowser } from "@/lib/supabase/browser";
import "azure-maps-control/dist/atlas.min.css";
import MarkerIcon from "@/image/map-marker-512.webp";
import {
  AzureMap,
  AzureMapDataSourceProvider,
  AzureMapHtmlMarker,
  AzureMapLayerProvider,
  AzureMapsProvider,
  IAzureMapControls,
} from "react-azure-maps";
import {
  AuthenticationType,
  data,
  HtmlMarkerOptions,
  Map,
  HtmlMarker,
} from "azure-maps-control";

type Props = {
  location: {
    id: number;
    childId: number;
    sectionId: number;
    latitude: string;
    longitude: string;
    timestamp: Date;
    accuracy: string;
    speed: string | null;
    altitude: string | null;
  };
};

const MapLocation = ({ location }: Props) => {
  const [coord, setCoord] = useState<ChildLocationData>(location);

  const [mapState, setMap] = useState<Map | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    let map = {
      authOptions: {
        authType: AuthenticationType.subscriptionKey,
        subscriptionKey: "70kjOhvsHo2jSRA1GGeRvZ8mo3tNzs4Hvr9hkPZi2gI"!,
      },
      center: [
        parseFloat(coord?.latitude || "6.6"),
        parseFloat(coord?.longitude || "35.35"),
      ],
      "view": "Auto",
      "style": "grayscale_dark",
      zoom: 10,
    };

    const geolocalization = supabase
      .channel("geolocalization")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "child_geolocation" },
        (payload) => {
          setCoord(payload.new as ChildLocationData);
        }
      )
      .subscribe();

    return () => {
      geolocalization.unsubscribe();
      if (map) {
      }
    };
  }, [coord]);

  return (
    <div ref={mapRef} className="w-full h-full overflow-auto">
      <AzureMapsProvider>
        {mapState ? (
          <AzureMap options={mapState}>
            <AzureMapDataSourceProvider id="markersDataSource">
              <AzureMapLayerProvider
                type="HtmlMarkerLayer"
                id="htmlMarkerLayer"
              />
              {renderHTMLPoint(
                [
                  parseFloat(coord?.latitude || "6.6"),
                  parseFloat(coord?.longitude || "35.35"),
                ],
                "htmlMarkerLayer"
              )}
            </AzureMapDataSourceProvider>
          </AzureMap>
        ) : (
          <></>
        )}
      </AzureMapsProvider>
    </div>
  );
};

export default MapLocation;

const renderHTMLPoint = (coordinates: data.Position, id: string) => {
  const rendId = Math.random().toString();
  return (
    <AzureMapHtmlMarker
      key={id}
      markerContent={
        <div className="pulseIcon">
          <img src={MarkerIcon.src} alt="Location" />
        </div>
      }
      options={azureHtmlMapMarkerOptions(coordinates)}
    />
  );
};

const azureHtmlMapMarkerOptions = (
  coordinates: data.Position
): HtmlMarkerOptions => ({
  position: coordinates,
  color: "DodgerBlue",

  text: "Child Location",
  title: "Child Location",
});
