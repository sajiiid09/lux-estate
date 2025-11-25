import requests
import sys

BASE_URL = "http://localhost:8000/api/auth"

def test_auth_flow():
    username = "jackdev"
    email = "jackdev@example.com"
    password = "jackdev123"

    # 1. Register
    print("Registering user...")
    reg_data = {
        "username": username,
        "email": email,
        "password": password,
        "first_name": "Jack",
        "last_name": "Dev"
    }
    try:
        response = requests.post(f"{BASE_URL}/register/", json=reg_data)
        if response.status_code == 201:
            print("Registration SUCCESS!")
        elif response.status_code == 400 and "already exists" in response.text:
            print("User already exists, proceeding to login...")
        else:
            print(f"Registration FAILED: {response.status_code}")
            print(response.text)
            sys.exit(1)
    except Exception as e:
        print(f"Registration error: {e}")
        sys.exit(1)

    # 2. Login
    print("Logging in...")
    login_data = {
        "username": username,
        "password": password
    }
    
    response = requests.post(f"{BASE_URL}/login/", json=login_data)
    
    if response.status_code == 200:
        data = response.json()
        print("Login SUCCESS!")
        print(f"Access Token: {data.get('access')[:20]}...")
        print(f"User Data: {data.get('user')}")
        
        if data.get('user', {}).get('username') == username:
            print("User username matches!")
            sys.exit(0)
        else:
            print("User data missing or incorrect!")
            sys.exit(1)
    else:
        print(f"Login FAILED: {response.status_code}")
        print(response.text)
        sys.exit(1)

if __name__ == "__main__":
    test_auth_flow()
