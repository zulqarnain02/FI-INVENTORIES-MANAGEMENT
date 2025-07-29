import requests
import os

BASE_URL = os.getenv("API_BASE_URL", "http://localhost:5000")

def print_result(test_name, passed, expected=None, got=None, request_data=None, response_body=None):
    """
    Prints test results in a standardized format.
    If passed, prints only success.
    If failed, prints request, expected vs got, and response body.
    """
    if passed:
        print(f"{test_name}: PASSED")
    else:
        print(f"--- {test_name}: FAILED ---")
        if request_data:
            print(f" Request: {request_data}")
        if expected is not None and got is not None:
            print(f" Expected: {expected}, Got: {got}")
        if response_body:
            print(f" Response Body: {response_body}")
        print("--- END OF TEST ---")


def test_register_user():
    """
    Tests user registration.
    """
    payload = {"name": "testuser", "email": "test@example.com", "password": "password"}
    res = requests.post(f"{BASE_URL}/register", json=payload)
    passed = res.status_code in [201, 400] 
    print_result("User Registration", passed, "201 or 400", res.status_code, payload, res.text)
    return passed


def test_login():
    """
    Tests user login and returns the auth token.
    """
    payload = {"email": "test@example.com", "password": "password"}
    res = requests.post(f"{BASE_URL}/login", json=payload)
    token = None
    passed = False
    if res.status_code == 200:
        try:
            token = res.json().get("token")
            passed = token is not None
        except Exception:
            passed = False
    print_result("Login Test", passed, "JWT token", token, payload, res.text)
    return token


def test_add_product(token):
    """
    Tests adding a new product.
    """
    payload = {
        "name": "Test Product",
        "type": "Test Type",
        "sku": "TEST-001",
        "image_url": "http://example.com/image.jpg",
        "description": "A test product.",
        "quantity": 10,
        "price": 99.99
    }
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.post(f"{BASE_URL}/products", json=payload, headers=headers)
    product_id = None
    passed = res.status_code == 201
    if passed:
        try:
            product_id = res.json().get("id")
        except Exception:
            pass
    print_result("Add Product", passed, 201, res.status_code, payload, res.text)
    return product_id


def test_update_quantity(token, product_id, new_quantity):
    """
    Tests updating a product's quantity.
    """
    if not product_id:
        print_result("Update Quantity", False, "Valid product_id", "None")
        return

    payload = {"quantity": new_quantity}
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.put(f"{BASE_URL}/products/{product_id}/quantity", json=payload, headers=headers)
    passed = res.status_code == 200
    print_result("Update Quantity", passed, 200, res.status_code, payload, res.text)


def test_get_products(token):
    """
    Tests fetching all products for a user.
    """
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(f"{BASE_URL}/products", headers=headers)
    passed = res.status_code == 200
    print_result("Get Products", passed, 200, res.status_code, None, res.text)


def run_all_tests():
    """
    Runs all API tests in sequence.
    """
    print("--- Starting API Tests ---")
    if not test_register_user():
        print("Registration test failed. Please check the backend.")

    token = test_login()
    if not token:
        print("Login failed. Skipping further tests.")
        return

    product_id = test_add_product(token)
    if not product_id:
        print("Product creation failed. Skipping further tests.")
        return

    new_quantity = 20
    test_update_quantity(token, product_id, new_quantity)
    test_get_products(token)
    print("--- API Tests Completed ---")


if __name__ == "__main__":
    run_all_tests()