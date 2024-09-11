<script>
  import { onMount } from "svelte";
  import { cityStore } from "../stores/cityStore.js";
  import { writable } from "svelte/store";

  let city;
  const historicalData = writable(null);

  // Reactively subscribe to the store
  $: $cityStore, (city = $cityStore);

  // Fetch historical data whenever the city changes
  $: {
    if (city) {
      fetchHistoricalData();
    }
  }

  async function fetchHistoricalData() {
    try {
      const response = await fetch(`/api/historical?city=${city}`);
      if (!response.ok) {
        throw new Error("Failed to fetch historical data");
      }
      historicalData.set(await response.json());
    } catch (error) {
      //   console.error("Error fetching historical data:", error);
    }
  }

  // Optionally, fetch data on initial mount
  onMount(() => {
    if (city) {
      fetchHistoricalData();
    }
  });
</script>

<div class="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
  <h2 class="text-xl font-bold mb-2">Historical Weather</h2>
  {#if $historicalData}
    <p>Date: {$historicalData.forecast.forecastday[0].date}</p>
    <p>Max Temp: {$historicalData.forecast.forecastday[0].day.maxtemp_c}°C</p>
    <p>Min Temp: {$historicalData.forecast.forecastday[0].day.mintemp_c}°C</p>
    <p>
      Condition: {$historicalData.forecast.forecastday[0].day.condition.text}
    </p>
    <img
      src={$historicalData.forecast.forecastday[0].day.condition.icon}
      alt="Weather Icon"
      class="w-16 h-16"
    />
  {/if}
</div>
