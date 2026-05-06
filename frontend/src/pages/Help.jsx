import React, { useState } from "react";


const Help = () => {
  const [email, setEmail] = useState("");
  const [tag, setTag] = useState("BUG");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await fetch("http://localhost:8080/api/support/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          tag,
          description,
        }),
      });


      const data = await response.json();


      if (response.ok) {
        setSuccess("Support ticket submitted");
        setError("");


        setEmail("");
        setTag("BUG");
        setDescription("");
      } else {
        setError(data.message || "Failed to submit ticket");
        setSuccess("");
      }
    } catch (err) {
      setError("Server not reachable");
      setSuccess("");
    }
  };


  return (
    <div className="login-container" style={{ flexDirection: "column", alignItems: "center" }}>
      <div className="login-card">
        <h2>Help & Support</h2>
        <p>Submit a ticket or browse guides below</p>


        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}


        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "15px", fontFamily: "inherit" }}
            required
          />


          <select 
            value={tag} 
            onChange={(e) => setTag(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          >
            <option value="BUG">Bug</option>
            <option value="HELP">Help</option>
            <option value="RESET">Reset</option>
          </select>


          <textarea
            placeholder="Describe your issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            style={{ width: "100%", padding: "10px", marginBottom: "15px", fontFamily: "inherit" }}
          />


          <button type="submit">Submit Ticket</button>
        </form>
      </div>


      {/* Guides */}
      <div className="login-card" style={{ marginTop: "20px" }}>
        <h3>How to Use the App</h3>


        <div className="guide-section">
          <h4>Submit a Ticket</h4>
          <p>To submit a Support Ticket please: <br />
            1. Enter a valid email address where you can be contacted <br />
            2. Select a Tag(Bug, Help, or Reset) <br /> 
            Bug - you would like to report that a feature of the application is not working correctly. <br />
            Help - A general help request(can be about anything you need help with). <br />
            Reset - You would like to reset your accounts password. <br />
            3. Describe the bug, what you need help with, or say that you would like to change your password.
            </p>
        </div>


        <div className="guide-section">
          <h4>Add Event</h4>
          <p>1. Click on the Calendar tab at the top of the screen <br />
             2. Click the add event button located in the top right part of the screen <br />
             3. Enter a name, Description, location, and select a start and end time. <br />
             4. Events are automatically set to public if you wish to make it private uncheck the purple box towards the bottom of the form. <br />
             5. Click create to make the event and add it to your calendar or click cancel to back out of the event creation
          </p>
        </div>
        
        <div className="guide-section">
          <h4>Invite friends to Events</h4>
          <p> To invite friends to Events<br />
          1. Click the "calendar" button in the navbar at the top of your screen.<br />
          2. Click the "invite friends" button<br />
          3. Pick the event you wish to invite a friend to<br />
          4. Select the friends you wish to invite to the event <br />
          5. Click the "Send Invites" button
          </p>
        </div>

        <div className="guide-section">
          <h4>Calendar Navigation</h4>
          <p>The calendar should automatically show you todays date and the month you are currently in. <br />
           If you wish to got to different month use the arrows in top right of the calendar page <br />
           Click the today button to be taken back to todays date quickly
           </p>
        </div>

        <div className="guide-section">
          <h4>Manage Profile</h4>
          <p> To manage your profile<br />
          1. Click your underlined username in the navbar at the top of your screen.<br />
          2. Click the fields you wish to change and make your changes<br />
          3. Save your changes<br />
          </p>
        </div>
       
        <div className="guide-section">
          <h4>Add Friend</h4>
          <p>To add a friend<br />
             1. Click the friends button in the navbar at the top of your screen.<br />
             2. Enter the friend you a wish to add's username and click search <br />
             3. The people with that username will show up and a add button will be below their name.<br />
             4. Click the add button to send that person a friend request<br />
             You can also view your friends list and the friend requests you have sent on the friends page<br />
             Your friends list can also be seen on the calendar page by clicking the show friends button towards to upper left part of the screen.
          </p>
        </div>
      </div>
    </div>
  );
};


export default Help;