# CalendarConnect
Software Engineering Project for a group of students at UW-Whitewater


# Running Calendar Connect
In order for you to run Calendar connect on your device, we recommend installing XAMPP for the easiest method. 

You can find the installation link here: [XAMPP Link](https://www.apachefriends.org/download.html)

Once you start up XAMPP, you can enable Apache and MySQL. In your browser of choice, navigate to [localhost/phpmyadmin](https://localhost/phpmyadmin/).
On your dashboard, navigate to databases, select import, import from file, and select the init.sql file in the database folder. Scroll to the bottom of the page, and select go. 

Once you have completed the tasks above, you are ready to run the program! 

On Windows machines, we found that it works best using two separate powershell windows. On Linux machines, we recommend using two separate terminals. 

In one terminal, navigate to the backend directory. 
On Windows machines, run 
```bash
.\mvnw spring-boot:run
```

On Linux machines, run 
```bash
./mvnw spring-boot:run
```

In another terminal, navigate to the frontend directory. 
Next, run 
```bash
npm install
npm run start
```

After following these instructions, you should have a Calendar Connect program running on your own machine!