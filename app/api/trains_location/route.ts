import { NextResponse } from "next/server";

interface Location {
    type: "Point";
    coordinates: [number, number]; // [経度, 緯度]
  }

interface TrainLocationData {
    trainNumber: number; // 列車番号
    location: Location; // 位置情報
    speed: number; // 速度（km/h）
  }

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const bbox = searchParams.get('bbox')
    try {
        const response = await fetch(`https://rata.digitraffic.fi/api/v1/train-locations/latest?bbox=${bbox}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        const filteredData = data.map((item: TrainLocationData) => ({
            trainNumber: item.trainNumber,
            location: item.location.coordinates,
            speed: item.speed
        }))
        return NextResponse.json(filteredData);
    } catch (error: Error | any) {
        return NextResponse.json({
            error: 'Failed to fetch data', 
            message: error.message,  // エラーメッセージ
            }, { status: 500});
    }
  }