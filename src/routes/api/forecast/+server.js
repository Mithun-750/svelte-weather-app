import { json } from '@sveltejs/kit';

export async function GET({ url }) {
    const city = url.searchParams.get('city') || 'New York';
    const days = url.searchParams.get('days') || '3';
    const apiKey = process.env.WEATHER_API_KEY;


    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${days}&aqi=yes&alerts=yes`);
    const data = await response.json();

    return json(data);
}
