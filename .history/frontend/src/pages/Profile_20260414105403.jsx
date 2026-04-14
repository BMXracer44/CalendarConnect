const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    const form = new FormData();

    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("first_name", formData.first_name);
    form.append("last_name", formData.last_name);
    form.append("birthdate", formData.birthdate);
    form.append("phone_number", formData.phone_number);
    form.append("bio", formData.bio);

    if (formData.profile_picture) {
      form.append("profile_picture", formData.profile_picture);
    }

    const response = await fetch(
      `http://localhost:8080/api/user/update/${user.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        body: form
      }
    );

    const data = await response.json();

    if (response.ok) {
      setSuccess("Profile updated successfully!");
      setError("");
    } else {
      setError(data.message || "Update failed");
      setSuccess("");
    }
  } catch (err) {
    setError("Server error");
  }
};