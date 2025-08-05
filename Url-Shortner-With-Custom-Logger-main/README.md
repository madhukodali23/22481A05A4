# URL Shortener with Custom Logger

## Overview

A fully functional URL shortener application built with Next.js and React, featuring bulk URL creation, custom shortcodes, expiry management, and comprehensive logging capabilities.

## Features

[![URL Shortener Application](url-shortner/demo-screenshot.png)](https://res.cloudinary.com/djnzrkoku/image/upload/v1754378713/Screenshot_2025-08-05_124828_ynjjzp.png)

_The URL Shortener application in action - showing the bulk URL creation form with validation and success feedback._

### Core Functionality

- **Bulk URL Shortening**: Create up to 5 shortened URLs at once
- **Custom Shortcodes**: Set your own custom shortcodes (3-10 alphanumeric characters)
- **URL Validation**: Comprehensive URL validation with helpful error messages
- **Expiry Management**: Set custom expiry dates for URLs
- **Click Tracking**: Monitor how many times each shortened URL has been accessed
- **Statistics Dashboard**: View all your URLs and their performance metrics
- **Automatic Redirection**: Seamless redirection from short URLs to original destinations
- **Error Handling**: Graceful handling of expired URLs and invalid shortcodes

### 🛠 Technical Features

- **Modern UI**: Beautiful Material-UI components with responsive design
- **Context Management**: React Context for state management
- **Client-Side Routing**: Next.js App Router with dynamic routes
- **Custom Logging**: Built-in logging middleware for debugging and monitoring
- **Input Validation**: Robust client-side validation utilities
- **Local Storage**: Persistent data storage in browser

### 📊 Statistics & Analytics

- View all shortened URLs in a comprehensive table
- Track click counts for each URL
- Monitor expiry status
- Sort and filter capabilities

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Url-Shortner-With-Custom-Logger
```

### Step 2: Install Dependencies

```bash
# Install logging middleware dependencies
cd logging-middleware
npm install

# Install frontend dependencies
cd ../url-shortner
npm install
```

### Step 3: Run the Application

```bash
# From the url-shortner directory
npm run dev
```

The application will start on `http://localhost:3000`

### Alternative: Production Build

```bash
npm run build
npm start
```

## Project Structure

```
├── url-shortner/                     # Main Next.js application
│   ├── src/
│   │   ├── app/                      # Next.js App Router pages
│   │   │   ├── page.js               # Home page with URL form
│   │   │   ├── stats/                # Statistics page
│   │   │   └── [shortcode]/          # Dynamic route for URL redirection
│   │   ├── components/               # Reusable React components
│   │   │   ├── Navigation.js         # Navigation bar
│   │   │   ├── StatsTable.js         # Statistics table component
│   │   │   └── UrlForm.js            # URL shortening form
│   │   ├── context/                  # React Context providers
│   │   │   └── UrlContext.js         # URL management context
│   │   └── utils/                    # Utility functions
│   │       ├── validators.js         # Input validation functions
│   │       └── logger/               # Logging utilities
│   └── package.json
├── logging-middleware/               # Custom logging middleware package
│   ├── index.js                     # Middleware implementation
│   └── package.json
└── README.md                        # This file
```

## Usage

### Creating Shortened URLs

1. Navigate to the home page
2. Enter your URL(s) in the form fields
3. Optionally set custom shortcodes and expiry dates
4. Click "Shorten URLs" to generate your shortened links
5. Copy and share your shortened URLs

### Viewing Statistics

1. Click on "Statistics" in the navigation
2. View all your created URLs with their click counts
3. Monitor expiry status and performance

### Using Shortened URLs

- Visit any shortened URL (e.g., `http://localhost:3000/abc123`)
- You'll be automatically redirected to the original URL
- Click counts are tracked automatically

## Technology Stack

- **Frontend**: Next.js 15, React 19
- **UI Framework**: Material-UI (MUI)
- **Styling**: CSS Modules, Emotion
- **State Management**: React Context
- **HTTP Client**: Axios
- **Validation**: Custom validation utilities
- **Logging**: Custom logging middleware

## Contributing

Feel free to fork this project and improve upon it. All contributions are welcome!

## License

This project is open source and available under the MIT License.

---

_Built with modern web technologies and best practices._ ✨
