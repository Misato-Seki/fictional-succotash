import { NextResponse } from "next/server";

interface TrainData {
    trainNumber: number; // 列車番号
    trainType: string; // ex: IC
    trainCategory: string; // ex: Long-distance
  }

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const train_number = searchParams.get('train_number')
    try {
        const response = await fetch(`https://rata.digitraffic.fi/api/v1/trains/latest/${train_number}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        const filteredData = data.map((item: TrainData) => ({
            trainNumber: item.trainNumber,
            trainType: item.trainType,
            trainCategory: item.trainCategory
        }))
        return NextResponse.json(filteredData);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch data'}, { status: 500});
    }
  }