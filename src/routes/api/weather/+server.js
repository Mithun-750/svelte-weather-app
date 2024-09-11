import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';
dotenv.config();


export async function GET({ url }) {
    const city = url.searchParams.get('city') || 'New York';
    const apiKey = process.env.WEATHER_API_KEY;

    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`);
    const data = await response.json();

    return json(data);
}
