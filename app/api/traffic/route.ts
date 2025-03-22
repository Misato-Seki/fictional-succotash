import { NextResponse } from "next/server";

interface Location {
    type: "Point";
    coordinates: [number, number]; // [経度, 緯度]
  }

interface TrainData {
    trainNumber: number; // 列車番号
    departureDate: string; // 出発日（ISO 8601形式）
    timestamp: string; // タイムスタンプ（ISO 8601形式）
    location: Location; // 位置情報
    speed: number; // 速度（km/h）
    accuracy: number; // 位置の精度
  }

export async function GET() {
    try {
        const response = await fetch('https://rata.digitraffic.fi/api/v1/train-locations/latest');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        const filteredData = data.map((item: TrainData) => ({
            trainNumber: item.trainNumber,
            location: item.location.coordinates,
        }))
        return NextResponse.json(filteredData);   
    } catch {
        return NextResponse.json({ error: 'Failed to fetch data'}, { status: 500});
        
    }
  }