import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await fetch('https://rata.digitraffic.fi/api/v1/train-locations/latest');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        const filteredData = data.map((item: any) => ({
            trainNumber: item.trainNumber,
            location: item.location.coordinates,
        }))
        return NextResponse.json(filteredData);   
    } catch {
        return NextResponse.json({ error: 'Failed to fetch data'}, { status: 500});
        
    }
  }