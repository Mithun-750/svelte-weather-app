<script>
  import { onMount } from "svelte";
  import { cityStore } from "../stores/cityStore.js"; // Import the store
  import CurrentWeather from "../components/CurrentWeather.svelte";
  import Forecast from "../components/Forecast.svelte";
  import Astronomy from "../components/Astronomy.svelte";
  import HistoricalWeather from "../components/HistoricalWeather.svelte";

  let autocomplete;

  onMount(async () => {
    try {
      await loadGoogleMaps();
      initAutocomplete();
    } catch (err) {
      console.error("Error loading Google Maps API:", err);
    }
  });

  function loadGoogleMaps() {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
      } else {
        const script = document.createElement("script");
        const apiKey = import.meta.env.VITE_GMAPS_API_KEY;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = () =>
          reject(new Error("Failed to load Google Maps API"));
        document.head.appendChild(script);
      }
    });
  }

  function initAutocomplete() {
    const input = document.getElementById("autocomplete");
    autocomplete = new google.maps.places.Autocomplete(input, {
      types: ["(cities)"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place && place.geometry) {
        cityStore.set(place.name);
      }
    });
  }
</script>

<div class="container mx-auto p-6">
  <div class="text-center mb-6">
    <h1 class="text-4xl font-bold">Weather Dashboard</h1>
    <p class="text-gray-500">
      Stay updated with the latest weather, forecasts, astronomy, and historical
      data.
    </p>

    <!-- Autocomplete Input -->
    <input
      id="autocomplete"
      type="text"
      class="mt-4 p-2 border border-gray-300 rounded-lg w-full md:w-1/2"
      placeholder="Enter a city..."
    />
  </div>

  <div class="flex flex-col items-center gap-6">
    <div class="flex flex-wrap justify-around gap-6">
      <CurrentWeather />
      <Astronomy />
      <HistoricalWeather />
    </div>
    <Forecast />
  </div>
</div>
