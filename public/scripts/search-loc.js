  // Function to fetch location suggestions from Google Places API
function fetchSuggestions() {
  const input = document.getElementById('locationInput').value.trim();
  const suggestionList = document.getElementById('suggestions');
  suggestionList.innerHTML = ''; // Clear previous suggestions

  if (input === '') {
      return; // If the input is empty, do nothing
  }

  // Use fetch to make a GET request to the /api/location endpoint (which will fetch from Google Places API)
  fetch(`/api/location?query=${input}`)
      .then((response) => response.json())
      .then((data) => {
          // If there's a message (like "Query parameter is required"), handle it
          if (data.message) {
              const li = document.createElement('li');
              li.textContent = data.message;
              suggestionList.appendChild(li);
              return;
          }

          // Otherwise, display the suggestions
          data.forEach((item) => {
              const li = document.createElement('li');
              li.textContent = item.formatted_address || 'Address not found';
              li.onclick = () => selectSuggestion(item); // Optional: Add a select suggestion functionality
              suggestionList.appendChild(li);
          });
      })
      .catch((err) => {
          console.error("Error fetching suggestions:", err);
          const li = document.createElement('li');
          li.textContent = 'Error fetching suggestions';
          suggestionList.appendChild(li);
      });
}

// Function to handle suggestion click and fill the input field
function selectSuggestion(suggestion) {
  const locationInput = document.getElementById('locationInput');
  locationInput.value = suggestion.formatted_address || 'Address not found';
  
  // Optionally, clear the suggestion list after selection
  document.getElementById('suggestions').innerHTML = '';
}

// Check if the coordinates are already available in localStorage or a variable
let coords = JSON.parse(localStorage.getItem('userCoords'));

if (coords) {
    // If coordinates are already available, skip the geolocation request and update the UI
    fetch('/api/get-address', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(coords),
    })
    .then(response => response.json())
    .then(data => {
        // Display the address received from the server
        document.querySelector(".locat-p").innerText = data.address;
        document.getElementById("locationInput").value = data.address;
        document.getElementById("select-location").setAttribute("title", data.address);
    })
    .catch(error => console.error('Error:', error));
} else {
    // Add event listener to fetch location if not already available
    document.getElementById("select-location").addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };

                    // Store coordinates in localStorage to avoid asking the user every time
                    localStorage.setItem('userCoords', JSON.stringify(coords));

                    // Send coordinates to the server for geocoding (reverse lookup)
                    fetch('/api/get-address', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(coords),
                    })
                    .then(response => response.json())
                    .then(data => {
                        // Display the address received from the server
                        document.querySelector(".locat-p").innerText = data.address;
                        document.getElementById("locationInput").value = data.address;
                        document.getElementById("select-location").setAttribute("title", data.address);
                    })
                    .catch(error => console.error('Error:', error));
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    });
}
blurFocusInput();
    function blurFocusInput() {
      let locationInput = document.getElementById('locationInput');
      locationInput.addEventListener("focus", function () {
        document.getElementById("woooh").classList.add("brdr")
      })
      // locationInput.addEventListener("blur", function () {
      //   document.getElementById("woooh").classList.remove("brdr")
      // })
    }
/*
// Debounce function to limit the frequency of API calls
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Function to fetch location suggestions from Google Places API
function fetchSuggestions() {
  const input = document.getElementById('locationInput').value.trim();
  const suggestionList = document.getElementById('suggestions');
  suggestionList.innerHTML = ''; // Clear previous suggestions

  if (input === '') {
      return; // If the input is empty, do nothing
  }

  // Use fetch to make a GET request to the /api/location endpoint (which will fetch from Google Places API)
  fetch(`/api/location?query=${input}`)
      .then((response) => response.json())
      .then((data) => {
          // If there's a message (like "Query parameter is required"), handle it
          if (data.message) {
              const li = document.createElement('li');
              li.textContent = data.message;
              suggestionList.appendChild(li);
              return;
          }

          // Otherwise, display the suggestions
          data.forEach((item) => {
              const li = document.createElement('li');
              li.textContent = item.formatted_address || 'Address not found';
              li.onclick = () => selectSuggestion(item); // Optional: Add a select suggestion functionality
              suggestionList.appendChild(li);
          });
      })
      .catch((err) => {
          console.error("Error fetching suggestions:", err);
          const li = document.createElement('li');
          li.textContent = 'Error fetching suggestions';
          suggestionList.appendChild(li);
      });
}

// Function to handle suggestion click and fill the input field
function selectSuggestion(suggestion) {
  const locationInput = document.getElementById('locationInput');
  locationInput.value = suggestion.formatted_address || 'Address not found';
  
  // Optionally, clear the suggestion list after selection
  document.getElementById('suggestions').innerHTML = '';
}

// Check if the coordinates are already available in localStorage or a variable
let coords = JSON.parse(localStorage.getItem('userCoords'));

if (coords) {
    // If coordinates are already available, skip the geolocation request and update the UI
    fetch('/api/get-address', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(coords),
    })
    .then(response => response.json())
    .then(data => {
        // Display the address received from the server
        document.querySelector(".locat-p").innerText = data.address;
        document.getElementById("locationInput").value = data.address;
        document.getElementById("select-location").setAttribute("title", data.address);
    })
    .catch(error => console.error('Error:', error));
} else {
    // Add event listener to fetch location if not already available
    document.getElementById("select-location").addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };

                    // Store coordinates in localStorage to avoid asking the user every time
                    localStorage.setItem('userCoords', JSON.stringify(coords));

                    // Send coordinates to the server for geocoding (reverse lookup)
                    fetch('/api/get-address', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(coords),
                    })
                    .then(response => response.json())
                    .then(data => {
                        // Display the address received from the server
                        document.querySelector(".locat-p").innerText = data.address;
                        document.getElementById("locationInput").value = data.address;
                        document.getElementById("select-location").setAttribute("title", data.address);
                    })
                    .catch(error => console.error('Error:', error));
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to retrieve your location. Please try again.');
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    });
}

// Apply debouncing to fetchSuggestions function to avoid excessive API calls
const debouncedFetchSuggestions = debounce(fetchSuggestions, 500); // 500ms delay

// Attach the debounced function to the input event (more reliable than keyup)
document.getElementById('locationInput').addEventListener('input', debouncedFetchSuggestions);

// Blur/Focus input handling
function blurFocusInput() {
    let locationInput = document.getElementById('locationInput');
    locationInput.addEventListener("focus", function () {
        document.getElementById("woooh").classList.add("brdr")
    })
    // locationInput.addEventListener("blur", function () {
    //   document.getElementById("woooh").classList.remove("brdr")
    // })
}

// Call the blurFocusInput function when the script loads
blurFocusInput();
