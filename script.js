const ipAddress = document.getElementById("ip-address")
const submitButton = document.getElementById("submit")

const ipAddressResult = document.querySelector("#ip .info")
const locationResult = document.querySelector("#location .info")
const timezoneResult = document.querySelector("#timezone .info")
const ispResult = document.querySelector("#isp .info")

const zoomLevel = 18
const maxZoom = 20

let map
let locationIcon = L.icon({
  iconUrl: './images/icon-location.svg', 
  iconSize:     [46, 56], // size of the icon
  iconAnchor:   [23, 56], // point of the icon which will correspond to marker's location
});
let marker = null

initializeMap()
submitButton.addEventListener("click", handleSubmit)

async function initializeMap() {
  let response
  try {
    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=at_9CxdENGJuZBg7BjmXuvn98FIghWhW&ipAddress=`
    response = await (await fetch(url)).json()
  } catch (error) {
    console.log(error)
  }

  ipAddressResult.innerHTML = response.ip
  locationResult.innerHTML = `${response.location.city}, ${response.location.country}`
  timezoneResult.innerHTML = `GMT${response.location.timezone}`
  ispResult.innerHTML = response.isp


  map = await L.map("map").setView([response.location.lat, response.location.lng], zoomLevel);
  await L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: maxZoom,
    attribution: "© OpenStreetMap",
  }).addTo(map);
  marker = await L.marker([response.location.lat, response.location.lng], {
    icon: locationIcon
  })
  .addTo(map)
}

async function displayResult(response){
  const ip = response.ip
  const location = `${response.location.city}, ${response.location.country}`
  const latitude = await response.location.lat
  const longtitude = await response.location.lng
  const timezone = `GMT${response.location.timezone}`
  const isp = response.isp
  
  await map.setView([latitude, longtitude], zoomLevel)
  await marker.setLatLng([latitude, longtitude])

  ipAddressResult.innerHTML = ip
  locationResult.innerHTML = location
  timezoneResult.innerHTML = timezone
  ispResult.innerHTML = isp
}

async function handleSubmit(event) {
  event.preventDefault()
  let response
  try {
    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=at_9CxdENGJuZBg7BjmXuvn98FIghWhW&ipAddress=${ipAddress.value}`
    response = await (await fetch(url)).json()
    console.log(response)
  } catch (error) {
    console.log(error)
  }

  await displayResult(response)
}