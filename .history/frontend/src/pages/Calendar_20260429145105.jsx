const createEvent = async (e) => {
  e.preventDefault();

  setErrorMessage("");

  try {
    const payload = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      startDatetime: formData.startDatetime,
      endDatetime: formData.endDatetime,
      isPublic: formData.isPublic
    };

    console.log("CREATING EVENT:", payload);

    const res = await fetch(
      `http://localhost:8080/api/events?userId=${user.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("CREATE EVENT FAILED:", errorText);
      setErrorMessage("Failed to create event");
      return;
    }

    // SUCCESS RESET
    setFormData({
      title: "",
      description: "",
      location: "",
      startDatetime: "",
      endDatetime: "",
      isPublic: true
    });

    setShowModal(false);
    loadEvents();

  } catch (err) {
    console.error("Server error:", err);
    setErrorMessage("Server error. Please try again.");
  }
};