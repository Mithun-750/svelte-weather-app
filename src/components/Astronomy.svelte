<script>
  import { onMount } from "svelte";
  import { cityStore } from "../stores/cityStore.js";
  import { writable } from "svelte/store";

  let city;
  const astronomyData = writable(null);

  // Reactively subscribe to the store
  $: $cityStore, (city = $cityStore);

  // Fetch astronomy data whenever the city changes
  $: {
    if (city) {
      fetchAstronomyData();
    }
  }

  async function fetchAstronomyData() {
    try {
      const response = await fetch(`/api/astronomy?city=${city}`);
      if (!response.ok) {
        throw new Error("Failed to fetch astronomy data");
      }
      astronomyData.set(await response.json());
    } catch (error) {
      // console.error("Error fetching astronomy data:", error);
    }
  }

  // Optionally, fetch data on initial mount
  onMount(() => {
    if (city) {
      fetchAstronomyData();
    }
  });
</script>

<div class="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
  <h2 class="text-xl font-bold mb-2">Astronomy</h2>
  {#if $astronomyData}
    <p>Sunrise: {$astronomyData.astronomy.astro.sunrise}</p>
    <p>Sunset: {$astronomyData.astronomy.astro.sunset}</p>
    <p>Moonrise: {$astronomyData.astronomy.astro.moonrise}</p>
    <p>Moonset: {$astronomyData.astronomy.astro.moonset}</p>
  {/if}
</div>
