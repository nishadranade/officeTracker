# Team Name - Gitone

# Solution Name - *Office Tracker*

# Solution Description
Allow employees in a post covid office to find out if they may be at risk based on concurrent
presence in meetings.

# Solution Features
Convenient app. Remembered login, scan a qr code to check in to a meeting room, easy click to check out

Web client to view data, add rooms/users, or (re)print qr codes

# Technologies and architecture used
Node.js (Server/Web Client)
* Express.js
* sqlite3

Native Android (App)
* Java
* Gradle
* QR Code

# What your code is designed for
The Android app is designed for use by individual employees, in order to log their attendance at meetings in our database. The Web Client is designed for use by office administration to easily determine at-risk employees, and enforce the necessary precautions (like work-from-home).

# What your code was written in
1. **Server/Web Client** - NodeJS, Express, sqlite3, HTML, CSS

2. **Android app** - Java, Gradle, XML

# Open source or proprietary software used
QR Code Scanner (Android) - [https://github.com/yuriy-budiyev/code-scanner](https://github.com/yuriy-budiyev/code-scanner)

QR Code Generator (Web Client) - [http://goqr.me/api/doc/create-qr-code/](http://goqr.me/api/doc/create-qr-code/)

# Why it's cool
It's fast, easy to use, and can increase employee safety on return to office.

# WoW factor
* Multi-platform integration
* Very relevant now, and in the future
* Could be easily expanded to support more complex risk/exposure analysis methods

# Future Enhancements
* Better User Experience and higher security
* Add support for advanced methods for determining exposure/risk for employees.

# Setup Instructions -
1. Clone the Bitbucket repo: **git clone https://bitbucket.fis.dev/projects/INNO20R/repos/gitone.git**

2. To set up the Web App, ensure that you have **node** and **node package manager (npm)** installed on your machine.

3. Navigate to the Web App directory, which is **/gitone/officeTracker/**, and do: **npm install**. This should fetch all **npm** dependencies.

4. From the same directory, execute: **node server-main.js** to start the server, and go to **http://localhost:8080/home/** in your browser to access the web client.

5. For the Android app, ensure you have **Android Studio** installed on your machine.

6. Open the **/gitone/AndroidApp/** directory in Android Studio, and wait for it to build.

7. Update the **base_url** field in the **/gitone/AndroidApp/app/src/main/res/values/strings.xml** file and put the IP-address **http://localhost:8080/home/** in it.

8. Run the app using the **Run** button in Android Studio.
