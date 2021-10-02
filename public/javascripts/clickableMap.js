mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-86.5970, 51.2593],
    zoom: 4
});
const marker = new mapboxgl.Marker();
const latLongInput = document.querySelector("#latLong");  
let coordinates;
function add_marker (event) {
  coordinates = event.lngLat;
  marker.setLngLat(coordinates).addTo(map);
  latLongInput.value=`${coordinates.lat}, ${coordinates.lng}`;
}
function getUserLatLong(){
  const userLatLong = latLongInput.value;
  const commaIndex = userLatLong.indexOf(",");
  const latitude = userLatLong.substring(0,commaIndex).trim();
  const longitude = userLatLong.substring(commaIndex+1).trim(); 
  const newCoordinates = {lat: latitude, lng: longitude};
  if(newCoordinates.lng && newCoordinates.lat)
  {
    coordinates = newCoordinates;
    marker.setLngLat(coordinates).addTo(map);
  }
}
const checkBox = document.querySelector("#manualLatLong");
checkBox.addEventListener("change",()=>{
  if(checkBox.checked)
  {
    latLongInput.disabled=false;
  }
  else
  {
    latLongInput.disabled=true;
  }
})
map.on('click', add_marker,);
latLongInput.addEventListener("input",getUserLatLong)

const campgroundButton = document.querySelectorAll("#addCampground,#updateCampground");

campgroundButton[0].addEventListener("click",()=>{
  if(latLongInput.disabled)
  {
    latLongInput.disabled=false;
  }
})