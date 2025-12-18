#!/usr/bin/env python3
"""Test runner script for the Procurement Quality Portal."""

import subprocess
import sys
import os
from pathlib import Path


def run_command(cmd, description):
    """Run a command and handle errors."""
    print(f"\n{'='*60}")
    print(f"Running: {description}")
    print(f"Command: {' '.join(cmd)}")
    print(f"{'='*60}")
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.stdout:
        print("STDOUT:")
        print(result.stdout)
    
    if result.stderr:
        print("STDERR:")
        print(result.stderr)
    
    if result.returncode != 0:
        print(f"❌ {description} failed with return code {result.returncode}")
        return False
    else:
        print(f"✅ {description} completed successfully")
        return True


def main():
    """Main test runner function."""
    # Change to backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    print("🧪 Procurement Quality Portal - Test Suite")
    print(f"Working directory: {os.getcwd()}")
    
    # Test commands to run
    test_commands = [
        {
            "cmd": ["python", "-m", "pytest", "--version"],
            "description": "Check pytest installation"
        },
        {
            "cmd": ["python", "-m", "pytest", "app/procurement/tests/", "-v"],
            "description": "Procurement Module Tests"
        },
        {
            "cmd": ["python", "-m", "pytest", "app/quality/tests/", "-v"],
            "description": "Quality Module Tests"
        },
        {
            "cmd": ["python", "-m", "pytest", "app/store/tests/", "-v"],
            "description": "Store Module Tests"
        },
        {
            "cmd": ["python", "-m", "pytest", "tests/test_integration.py", "-v"],
            "description": "Integration Tests"
        },
        {
            "cmd": ["python", "-m", "pytest", "--cov=app", "--cov-report=term-missing"],
            "description": "All Tests with Coverage"
        }
    ]
    
    # Run each test command
    results = []
    for test_config in test_commands:
        success = run_command(test_config["cmd"], test_config["description"])
        results.append((test_config["description"], success))
    
    # Summary
    print(f"\n{'='*60}")
    print("TEST SUMMARY")
    print(f"{'='*60}")
    
    passed = 0
    failed = 0
    
    for description, success in results:
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status}: {description}")
        if success:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal: {len(results)} | Passed: {passed} | Failed: {failed}")
    
    if failed > 0:
        print("\n❌ Some tests failed. Please check the output above.")
        sys.exit(1)
    else:
        print("\n🎉 All tests passed!")
        sys.exit(0)


if __name__ == "__main__":
    main()