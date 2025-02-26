import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address1 = searchParams.get("address1");
  const address2 = searchParams.get("address2");

  if (!address1 || !address2) {
    return NextResponse.json(
      { error: "Both addresses are required" },
      { status: 400 },
    );
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${encodeURIComponent(address1)}&destinations=${encodeURIComponent(address2)}&key=${GOOGLE_MAPS_API_KEY}`,
    );
    console.log(response.data.rows[0].elements[0].duration);

    const data = response.data;
    if (data.status !== "OK") {
      return NextResponse.json(
        { error: "Error calculating distance" },
        { status: 500 },
      );
    }

    const distance = data.rows[0].elements[0].distance.text;
    const duration = data.rows[0].elements[0].duration.value * 2.75;

    return NextResponse.json({ distance, duration }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error calculating distance" },
      { status: 500 },
    );
  }
}
