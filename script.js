fetch('https://your-backend-endpoint.com/data.json') // Replace with actual backend
  .then(response => response.json())
  .then(data => {
    document.getElementById('data').innerHTML = `
      <p>Humidity: ${data.humidity}%</p>
      <p>Temperature: ${data.temperature}°C</p>
    `;
  });
