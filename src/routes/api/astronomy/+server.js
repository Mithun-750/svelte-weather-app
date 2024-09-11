import { json } from '@sveltejs/kit';

export async function GET({ url }) {
    const city = url.searchParams.get('city') || 'New York';
    const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
    const apiKey = process.env.WEATHER_API_KEY;


    const response = await fetch(`https://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${city}&dt=${date}`);
    const data = await response.json();

    return json(data);
}
