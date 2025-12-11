# API Contract

## Base URL
`http://localhost:8000/api/v1`

## Endpoints

### GET /vendors
Retrieve list of vendors

**Response:**
```json
{
  "vendors": [
    {
      "id": "string",
      "name": "string",
      "status": "active|inactive"
    }
  ]
}
```

### POST /po
Create a new Purchase Order

**Request:**
```json
{
  "vendor_id": "string",
  "items": [
    {
      "product_id": "string",
      "quantity": "number",
      "unit_price": "number"
    }
  ]
}
```

**Response:**
```json
{
  "po_id": "string",
  "status": "created",
  "total_amount": "number"
}
```

### POST /mr
Create a Material Request

**Request:**
```json
{
  "department": "string",
  "items": [
    {
      "product_id": "string",
      "quantity": "number",
      "urgency": "low|medium|high"
    }
  ]
}
```

**Response:**
```json
{
  "mr_id": "string",
  "status": "pending"
}
```

### POST /qc/inspect
Submit Quality Control Inspection

**Request:**
```json
{
  "batch_id": "string",
  "inspector_id": "string",
  "results": [
    {
      "parameter": "string",
      "value": "string",
      "status": "pass|fail"
    }
  ]
}
```

**Response:**
```json
{
  "inspection_id": "string",
  "overall_status": "pass|fail",
  "timestamp": "string"
}
```

### GET /inventory
Retrieve inventory status

**Response:**
```json
{
  "items": [
    {
      "product_id": "string",
      "name": "string",
      "current_stock": "number",
      "min_stock": "number",
      "status": "in_stock|low_stock|out_of_stock"
    }
  ]
}
```