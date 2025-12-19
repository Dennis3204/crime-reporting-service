# Crime Reporting Application

A full-stack Node/Express/MongoDB web app for posting, browsing, and discussing neighborhood crime reports.

## Features

- **Authentication**: Sign up, log in, log out (session-based)
- **Reports**
  - Create reports with title, description, crime type, and location
  - Optional photo uploads (stored under `public/uploads/reports/`)
  - Edit/delete your own reports
  - Anonymous posting option
- **Comments**
  - Leave comments on reports
  - Like/dislike comments
  - Sort comments by best/worst/newest/oldest
- **Search**
  - Search reports by **title** or **crime type**
- **Map Browse**
  - Browse reports by NYC ZIP code using an interactive map

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Templating**: Handlebars
- **Auth**: `express-session`
- **Uploads**: `multer`

## Prerequisites

- **Node.js + npm** (recommended: current LTS)
- **MongoDB Community Edition** running locally

## Installation

```bash
npm install
```

## Environment / Configuration

This project uses the MongoDB connection settings defined in:

- `src/config/settings.js`
- `src/config/mongoConnection.js`

Make sure MongoDB is running and the configured database name/URL are correct.

## Database Seed

To populate the database with sample users and reports:

```bash
npm run seed
```

Notes:
- The seed script clears the existing `users` and `reports` collections.
- `comments` are not seeded.

## Run the App

```bash
npm start
```

Then open:

- `http://localhost:3000`

## Usage Guide (Quick)

1. **Sign up** at `/signup`
2. **Log in** at `/login`
3. Use the nav links to:
   - View all reports (`/reports`)
   - Create a report (`/reports/new`)
   - Search reports (`/search`)
   - Browse by ZIP code (`/map`)
   - Update your profile/location (`/profile`)

## Input Validation Rules (High-Level)

Server-side validation is enforced in `src/helpers/validation.js`.

- **Username**: 3–20 chars, letters/numbers only, must include at least one letter
- **Password**: 8+ chars, must include at least one letter and one number, no whitespace
- **Names / City / State / Neighborhood**: letters/spaces/common punctuation only (no numeric-only)
- **ZIP Code**: exactly 5 digits
- **Report fields**:
  - Title: minimum length
  - Description: minimum length
  - Crime type: minimum length

Client-side constraints (`pattern`, `minlength`, etc.) are also present in the forms for better UX.

## Security Notes

- Templates render user content using Handlebars escaping (no raw HTML rendering).
- File uploads are restricted to common safe image types (`.jpg/.jpeg/.png/.gif/.webp`).
- Protected routes require login via middleware.

## Project Structure (Key Paths)

- `src/app.js` — server entry
- `src/routes/` — Express route modules
- `src/data/` — data access layer (MongoDB)
- `src/views/` — Handlebars templates
- `public/` — static assets (CSS/JS/uploads)

## Authors

Developed by **Pranav Chaudhari, Elian Fernandez, Thomas Kain, and Dennis Ren** for **CS 546: Web Programming I** at Stevens Institute of Technology.
