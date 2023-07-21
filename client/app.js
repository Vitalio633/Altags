// Function to fetch images from the server-side proxy
function fetchImages() {
    const urlInput = document.getElementById("urlInput");
    const targetURL = urlInput.value;


// Make a request to the server-side proxy
fetch(`http://localhost:3000/proxy?url=${encodeURIComponent(targetURL)}`)
    .then(response => response.json())
    .then(images => {
    showImageList(images);
    })
    .catch(error => {
    console.error("Error fetching images:", error);
    });
}

// Function to display the list of images on the page
function showImageList(images) {
  const imageListDiv = document.getElementById("imageList");
  imageListDiv.innerHTML = "";

  if (images.error) {
    imageListDiv.innerHTML = `Error: ${images.error}`;
  } else if (images.length === 0) {
    imageListDiv.innerHTML = "No images found.";
  } else {
    const ul = document.createElement("ul");
    images.forEach((image) => {
      const li = document.createElement("li");
      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.alt;
      li.appendChild(img);
      ul.appendChild(li);
    });
    imageListDiv.appendChild(ul);
  }
}
