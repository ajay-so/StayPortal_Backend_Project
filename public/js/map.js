maptilersdk.config.apiKey = apiKey;

const map = new maptilersdk.Map({
  container: 'map', // container's id or the HTML element where the map will render
  style: maptilersdk.MapStyle.STREETS, // Map style
  center: coordinates, // starting position [lng, lat]
  zoom: 6 // starting zoom level
});

let marker = new maptilersdk.Marker({
  color: "red", // Marker color 
})
  .setLngLat(coordinates)
  .setPopup(new maptilersdk.Popup({ offset: 20 })
    .setHTML("<h6>Welcome to StayNest :)</h6>")
  )
  .addTo(map);


