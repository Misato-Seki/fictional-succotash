import React from 'react'

interface Train {
    trainNumber: number
    location: number[]
}

export default async function TrafficData() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/traffic`)
    const trains = await data.json()
  return (
    <div>
        <ul>
            {trains.map((train: Train) =>(
                <li key={train.trainNumber}>{train.trainNumber} {train.location[0]} {train.location[1]}</li>
            ))}
        </ul>
    </div>
  )
}
