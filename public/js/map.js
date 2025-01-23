
const map = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', // custom style URL
    center: [78.9629, 20.5937], // starting position [lng, lat] for India
    zoom: 4, // adjusted zoom level for India
    maplibreLogo: false // hide MapLibre logo
});