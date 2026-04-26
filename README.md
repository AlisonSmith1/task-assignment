# Task Assignment System

A modern web application built with Angular 21 designed to streamline the process of assigning delivery tasks to drivers.

## Features

- **Drag-and-Drop Assignment**: Intuitively assign tasks from the unassigned task pool to specific drivers using an interactive drag-and-drop interface powered by Angular CDK.
- **Task Recall**: Tasks can be recalled back to the pool, requiring the user to specify a reason which is then logged in the task's history for audit and transparency.
- **Status Simulation**: Simulates real-time task progression (e.g., Unassigned → Assigned → Accepted → Completed).
- **Responsive Interface**: A modern UI designed for easy task tracking and management.

## Tech Stack

- **Framework**: Angular (version 21.0.4)
- **UI Components**: Angular Material & Angular CDK (Drag & Drop, Dialog, etc.)
- **Reactivity**: RxJS
- **Mock Backend**: `json-server` (and faker for mock data generation)
- **Testing**: Vitest

## Getting Started

### Prerequisites

- Node.js (version 20 or higher recommended)
- npm (version 10 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AlisonSmith1/task-assignment.git
   cd task-assignment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the local development server:

```bash
npm start
# or
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

*(Note: The project uses a mock API with generated data or a fallback to mock data defined in the service if the backend is not accessible.)*

## Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running Unit Tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
npm run test
```

## License

ISC
