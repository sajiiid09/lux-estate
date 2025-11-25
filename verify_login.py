import requests
import sys

BASE_URL = "http://localhost:8000/api/auth"

def test_login():
    email = "jackdev@example.com"
    password = "jackdev123"

    # 1. Try to register (ignore if already exists)
    print("Registering user...")
    reg_data = {
        "email": email,
        "password": password,
        "first_name": "Jack",
        "last_name": "Dev"
    }
    try:
        requests.post(f"{BASE_URL}/register/", json=reg_data)
    except Exception as e:
        print(f"Registration skipped/failed (might already exist): {e}")

    # 2. Try to login
    print("Logging in...")
    login_data = {
        "email": email,
        "password": password
    }
    
    response = requests.post(f"{BASE_URL}/login/", json=login_data)
    
    if response.status_code == 200:
        data = response.json()
        print("Login SUCCESS!")
        print(f"Access Token: {data.get('access')[:20]}...")
        print(f"User Data: {data.get('user')}")
        
        if data.get('user', {}).get('email') == email:
            print("User email matches!")
            sys.exit(0)
        else:
            print("User data missing or incorrect!")
            sys.exit(1)
    else:
        print(f"Login FAILED: {response.status_code}")
        with open("error.html", "w") as f:
            f.write(response.text)
        print("Error saved to error.html")
        sys.exit(1)

if __name__ == "__main__":
    test_login()
