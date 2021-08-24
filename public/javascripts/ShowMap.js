mapboxgl.accessToken = mapAccessTokenSM;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());
const marker1 = new mapboxgl.Marker()
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map);