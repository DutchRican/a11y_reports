# Accessibility Reports Dashboard

A React application for visualizing accessibility scan results from Cypress-axe, with a MongoDB backend for data persistence.

## Project Structure

```
├── server/                  # Backend API
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express route handlers
│   ├── controllers/         # API logic
│   ├── middleware/          # Express middleware
│   ├── utils/               # Utility functions
│   ├── seed.js              # Database seeding script
│   ├── index.js             # Express server entry point
│   └── .env.example         # Environment variable template
├── src/                     # Frontend React application
│   ├── components/          # Reusable UI components
│   │   ├── charts/          # Chart components (Recharts)
│   │   ├── tables/          # Table components
│   │   └── violations/      # Violation display components
│   ├── pages/               # Page-level components
│   │   ├── ADAInfoPage.tsx
│   │   ├── DetailViewPage.tsx
│   │   └── OverviewPage.tsx
│   ├── api/                 # API request logic
│   ├── types/               # Shared type definitions
│   ├── App.tsx              # Main application component
│   └── main.tsx             # React entry point
├── public/                  # Static assets
│   └── sample-data_copy.json
├── package.json             # Project metadata and scripts
├── docker-compose.yml       # Docker configuration
└── README.md                # Project documentation
```

## Prerequisites

- Node.js (v22 or higher)
- MongoDB (running locally or accessible URL)
- npm or yarn package manager

## Setup

### Local Development
1. Install MongoDB if you haven't already:
   ```bash
   # macOS (using Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```

2. Set up the backend:
   ```bash
   cd server
   npm install
   cp .env.example .env  # Configure your MongoDB URI
   npm run seed          # Seed the database with sample data
   npm run dev           # Start the development server
   ```

3. Set up the frontend:
   ```bash
   # From the project root
   npm install
   npm run dev
   ```

4. The backend API will be available at `http://localhost:3001`
5. The frontend application will be available at `http://localhost:5173`

### Docker Setup
1. Build and run the containers:
   ```bash
   docker-compose up --build
   ```

2. The application will be available at: http://localhost:3001

## Usage
### Scan-results Endpoints

- **GET** `/api/scan-results`  
  Retrieve all accessibility scan results.

- **GET** `/api/scan-results/:id`  
  Retrieve a specific scan result by its ID.

- **POST** `/api/scan-results`  
  Create a new scan result (expects JSON payload).

- **POST** `/api/scan-results/upload`  
  Upload a single scan result file (multipart/form-data).

- **POST** `/api/scan-results/upload-multiple`  
  Upload multiple scan result files (multipart/form-data).

### Project Endpoints

- **GET** `/api/projects`  
  Retrieve all projects.

- **GET** `/api/projects/:id`  
  Retrieve a specific project by its ID.

- **POST** `/api/projects`  
  Create a new project (expects JSON payload).

- **PUT** `/api/projects/:id`  
  Update an existing project by its ID.

- **DELETE** `/api/projects/:id`  
  Delete a project by its ID.

## Data Format

The API expects scan results in the following format:
This may also be an array of items.
```json
{
  "testName": "example-spec",
  "url": "http://example.com",
  "created": "2023-08-15T10:30:00Z",
  "violations": [
    {
      "id": "violation-id",
      "impact": "critical",
      "description": "Violation description",
      "help": "Help text",
      "helpUrl": "https://example.com/help",
      "nodes": [
        {
          "html": "<div>Example</div>",
          "target": [".example-class"]
        }
      ]
    }
  ]
}
```

## Development

- Frontend code is written in TypeScript and React
- Backend uses Express.js and Mongoose
- Data visualization uses TailwindCSS and Recharts

## Prep with test data
! this will wipe out existing data!!!!  
`npm run seed`

## Curl

Fetch all reports for a specific project:  
```bash
curl "http://localhost:3001/api/scan-results?projectId=YOUR_PROJECT_ID"
```

Fetch report by ID for a specific project:  
```bash
curl "http://localhost:3001/api/scan-results/686ae14be3e44e6712e3f4ec?projectId=YOUR_PROJECT_ID"
```

Upload a file for a specific project:
```bash
curl "http://localhost:3001/api/scan-results/upload?projectId=YOUR_PROJECT_ID" -F "file=@/public/sample-data_copy.json"
```

Upload multiple files for a specific project:
```bash
curl "http://localhost:3001/api/scan-results/upload-multiple?projectId=YOUR_PROJECT_ID" \
  -F "files=@/location/test-result.json" \
  -F "files=@sample-data_copy.json"
```
