<script>
  import { onMount } from "svelte";
  import { cityStore } from "../stores/cityStore.js";
  import { writable } from "svelte/store";

  let city;
  const weatherData = writable(null);

  // Reactively subscribe to the store
  $: $cityStore, (city = $cityStore);

  // Fetch weather data whenever the city changes
  $: {
    if (city) {
      fetchWeatherData();
    }
  }

  async function fetchWeatherData() {
    try {
      const response = await fetch(`/api/weather?city=${city}`);
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      weatherData.set(await response.json());
    } catch (error) {
      //   console.error("Error fetching weather data:", error);
    }
  }

  // Optionally, fetch data on initial mount
  onMount(() => {
    if (city) {
      onMount(() => {
        fetchWeatherData();
      });
    }
  });
</script>

<div class="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
  <h2 class="text-xl font-bold mb-2">Current Weather</h2>
  {#if $weatherData}
    <p>
      Location: {$weatherData.location.name}, {$weatherData.location.region}
    </p>
    <p>Temperature: {$weatherData.current.temp_c}°C</p>
    <p>Condition: {$weatherData.current.condition.text}</p>
    <img src={$weatherData.current.condition.icon} alt="Weather Icon" />
  {/if}
</div>
