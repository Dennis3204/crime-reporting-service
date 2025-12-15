# Crime Reporting Application

This repository contains a crime reporting web application that allows users to post and view crime reports. With this application, you can:

* Post and browse neighborhood crime reports and tips in one place.
  * Crime reports can be given a description, location, classification, etc.
  * Reports can also be edited or deleted after being created.
* Leave comments on individual reports that can be liked and disliked.
  * Comments can be sorted through by their age or number of likes.
* View a list of all reports or search through them by their name or crime type.
* Browse the reports in a given ZIP code through an interactive map.

This application was developed using Node.js, MongoDB, Express.js, Handlebars, and a handful of other libraries.

This was developed by Pranav Chaudhari, Elian Fernandez, Thomas Kain, and Dennis Ren as their final project for CS 546: Web Programming I at the Stevens Institute of Technology.

## Setup

1. First, ensure that you have the latest versions of the following installed:
   * [Node.js and NPM](https://nodejs.org/en/download).
   * [MongoDB Community Edition](https://www.mongodb.com/try/download/community).
2. Next, download the project's NPM dependencies by running `npm install` in the project's directory.
3. To populate the application's database with sample reports and accounts, run the command `npm run seed` in the project's directory.
   * (This is optional and only needs to be done once unless you want to restore the sample data.)
4. Lastly, to run the application, run the command `npm start` in the project's directory.
   * The application can be accessed at `http://localhost:3000` in your web browser.
