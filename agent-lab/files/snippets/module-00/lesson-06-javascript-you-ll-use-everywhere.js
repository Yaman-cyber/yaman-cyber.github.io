// async in 10 lines
// "async" marks a function that waits for slow things
async function getWeather(city) {
  const res = await fetch("https://wttr.in/" + city + "?format=3"); // wait for the network
  return await res.text();
}

// "await" pauses until the answer arrives
const report = await getWeather("Abu Dhabi");
console.log(report);
