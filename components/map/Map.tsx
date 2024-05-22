"use client";
import { GoogleMapsEmbed } from '@next/third-parties/google'

import { useEffect, useRef, useState } from "react";
import { ChildLocationData } from "@/types";
import { supabaseBrowser } from "@/lib/supabase/browser";

import {
  AuthenticationType,
  data,
  HtmlMarkerOptions,
  Map,
  HtmlMarker,
} from "azure-maps-control";
import {AZURE_MAP_KEY} from "@/lib/constant";

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
        subscriptionKey: AZURE_MAP_KEY,
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
      <GoogleMapsEmbed
          apiKey="XYZ"
          height={200}
          width="100%"
          mode="place"
          q="Brooklyn+Bridge,New+York,NY"
      />
  );
};

export default MapLocation;

