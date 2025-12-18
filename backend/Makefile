# Procurement Quality Portal - Test Commands

.PHONY: help test test-unit test-integration test-coverage install-deps clean

help:
	@echo "Available commands:"
	@echo "  install-deps     Install testing dependencies"
	@echo "  test            Run all tests"
	@echo "  test-unit       Run unit tests only"
	@echo "  test-integration Run integration tests only"
	@echo "  test-coverage   Run tests with coverage report"
	@echo "  clean           Clean test artifacts"

install-deps:
	pip install -r requirements.txt

test:
	python run_tests.py

test-unit:
	python -m pytest app/procurement/tests/ app/quality/tests/ app/store/tests/ -v

test-integration:
	python -m pytest tests/test_integration.py -v

test-coverage:
	python -m pytest --cov=app --cov-report=html --cov-report=term-missing

clean:
	rm -rf .pytest_cache/
	rm -rf htmlcov/
	rm -rf .coverage
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete