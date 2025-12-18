"""Tests for the main unified application."""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app


@pytest.fixture
def client():
    """Create a test client for the main application."""
    return TestClient(app)


class TestMainApplication:
    """Tests for the main unified FastAPI application."""
    
    def test_root_endpoint(self, client):
        """Test the root endpoint."""
        response = client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Procurement Quality Portal API"
        assert data["version"] == "1.0.0"
        assert data["status"] == "running"
        assert "modules" in data
        
        # Check all modules are present
        modules = data["modules"]
        assert "procurement" in modules
        assert "quality" in modules
        assert "store" in modules
        
        # Check module structure
        for module_name, module_info in modules.items():
            assert "status" in module_info
            assert "endpoints" in module_info
            assert module_info["status"] == "active"
    
    def test_health_check(self, client):
        """Test the health check endpoint."""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "procurement-quality-portal"
        assert "modules" in data
        
        # Check all modules are operational
        modules = data["modules"]
        assert modules["procurement"] == "operational"
        assert modules["quality"] == "operational"
        assert modules["store"] == "operational"
    
    def test_api_status(self, client):
        """Test the API status endpoint."""
        response = client.get("/api/status")
        
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Procurement Quality Portal - Unified API"
        assert "modules" in data
        
        # Check module documentation
        modules = data["modules"]
        expected_modules = ["Procurement", "Quality", "Store"]
        
        for module_name in expected_modules:
            assert module_name in modules
            module_info = modules[module_name]
            assert "description" in module_info
            assert "prefix" in module_info
            assert "endpoints" in module_info
            assert isinstance(module_info["endpoints"], list)
    
    def test_openapi_docs_accessible(self, client):
        """Test that OpenAPI documentation is accessible."""
        response = client.get("/docs")
        assert response.status_code == 200
        
        response = client.get("/redoc")
        assert response.status_code == 200
        
        response = client.get("/openapi.json")
        assert response.status_code == 200