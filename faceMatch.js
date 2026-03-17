async function findMyPhotos() {
  const selfie = document.getElementById("photo").files[0]; // make sure input id="photo"
  const eventId = localStorage.getItem("eventId");

  if (!selfie) {
    alert("Please upload a photo");
    return;
  }

  if (!eventId) {
    alert("Event ID missing. Go back to dashboard.");
    return;
  }

  const formData = new FormData();
  formData.append("photo", selfie); // must match multer.single key

  try {
    const res = await fetch(`/api/face/match/${eventId}`, {
      method: "POST",
      body: formData
    });

    /* ✅ Added check for server error */
    if (!res.ok) {
      throw new Error("Server error while matching photos");
    }

    const data = await res.json();
    const result = document.getElementById("result");
    result.innerHTML = "";

    /* ✅ Safer check for photos array */
    if (!data || !data.photos || data.photos.length === 0) {
      result.innerHTML = "<p>No matching photos found</p>";
      return;
    }

    data.photos.forEach(url => {
      const img = document.createElement("img");
      img.src = url;
      img.style.width = "200px";
      img.style.margin = "10px";
      img.style.borderRadius = "8px";

      /* ✅ Small improvement to avoid broken images */
      img.onerror = () => {
        img.style.display = "none";
      };

      result.appendChild(img);
    });

  } catch (err) {
    console.error(err);
    alert("Error occurred while matching photos. Try again later.");
  }
}