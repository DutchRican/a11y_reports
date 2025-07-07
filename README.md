# Accessibility Reports Dashboard

A React application for visualizing accessibility scan results from Cypress-axe, with a MongoDB backend for data persistence.

## Project Structure

```
├── server/           # Backend API
│   ├── models/       # MongoDB schemas
│   ├── index.js      # Express server
│   └── seed.js       # Database seeding script
└── src/             # Frontend React application
    ├── components/   # Reusable components
    │   ├── charts/    # Chart components
    │   ├── tables/    # Table components
    │   └── violations/ # Violation display components
    ├── pages/        # Page components
    │   ├── ADAInfoPage.tsx
    │   ├── DashboardPage.tsx
    │   └── OverviewPage.tsx
    ├── types.ts      # Shared type definitions
    └── App.tsx       # Main application component
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
API Endpoints:
   - GET `/api/scan-results` - Retrieve all scan results
   - GET `/api/scan-results/:id` - Retrieve a specific scan result
   - POST `/api/scan-results` - Create a new scan result

## Data Format

The API expects scan results in the following format:

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
Fetch all reports:  
```bash
curl http://localhost:3001/api/scan-results/686ae14be3e44e6712e3f4ec
```  

Fetch Report by ID:  
```bash
curl http://localhost:3001/api/scan-results 
```  
Upload a file:
```bash
curl http://localhost:3001/api/scan-results/upload -F "file=@/public/sample-data_copy.json"
```

Upload multiple files:
```bash
 curl http://localhost:3001/api/scan-results/upload-multiple -F "files=@/location/test-result.json" -F "files=@sample-data_copy.json"
```
