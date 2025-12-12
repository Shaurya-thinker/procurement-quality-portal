# Procurement Quality Portal

A comprehensive platform for managing procurement processes and quality control operations.

## Project Structure

```
procurement-quality-portal/
├── backend/              # FastAPI backend application
│   ├── app/             # Main application package
│   │   ├── core/        # Core configuration and utilities
│   │   ├── utils/       # Utility functions
│   │   ├── procurement/ # Procurement module
│   │   ├── quality/     # Quality control module
│   │   └── store/       # Inventory/Store module
│   ├── migrations/      # Database migrations
│   └── tests/           # Backend tests
├── frontend/            # Frontend application
│   └── src/
│       ├── procurement/ # Procurement UI components
│       ├── quality/     # Quality control UI components
│       └── store/       # Store/Inventory UI components
├── docs/                # Documentation
└── README.md           # This file
```

## Modules

### Procurement Module
Handles purchase orders, vendor management, and procurement workflows.

### Quality Module
Manages quality control inspections, defect tracking, and compliance.

### Store Module
Manages inventory, stock levels, and storage operations.

## Getting Started

### Backend Setup

1. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Run the application:
   ```bash
   python -m app.main
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install and run frontend application (instructions to follow)

## Documentation

See the [docs](./docs) folder for detailed API documentation and guides.

## License

(Add license information here)
