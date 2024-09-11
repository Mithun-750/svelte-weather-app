<script>
  import { onMount } from "svelte";
  import { cityStore } from "../stores/cityStore.js";
  import { writable } from "svelte/store";

  let city;
  const forecastData = writable(null);

  // Reactively subscribe to the store
  $: $cityStore, (city = $cityStore);

  // Fetch forecast data whenever the city changes
  $: {
    if (city) {
      fetchForecastData();
    }
  }

  let fetchForecastData = async () => {
    try {
      const response = await fetch(`/api/forecast?city=${city}`);
      if (!response.ok) {
        throw new Error("Failed to fetch forecast data");
      }
      forecastData.set(await response.json());
    } catch (error) {
      //   console.error("Error fetching forecast data:", error);
    }
  };

  // Optionally, fetch data on initial mount
  onMount(() => {
    if (city) {
      fetchForecastData();
    }
  });
</script>

<div
  class="bg-white shadow-md rounded-lg p-4 w-full flex flex-col items-center"
>
  <h2 class="text-3xl font-bold mb-10 text-center">Forecast</h2>
  <div
    class=" flex flex-wrap gap-6 justify-around w-full max-w-screen-md mx-auto"
  >
    {#if $forecastData}
      {#each $forecastData.forecast.forecastday as day}
        <div class="mb-4 flex flex-col items-center shadow-md p-4 rounded">
          <p>Date: {day.date}</p>
          <p>Condition: {day.day.condition.text}</p>
          <p>Max Temp: {day.day.maxtemp_c}°C</p>
          <p>Min Temp: {day.day.mintemp_c}°C</p>
          <img
            src={day.day.condition.icon}
            alt="Weather Icon"
            class="w-16 h-16"
          />
        </div>
      {/each}
    {/if}
  </div>
</div>
