import requests
import json

BASE_URL = "http://localhost:8000"

def test_apis():
    print("=" * 50)
    print("Testing All TODO APIs")
    print("=" * 50)

    # Step 1: Register
    print("\n1. Registering new user...")
    import random
    register_data = {
        "email": f"testuser{random.randint(1000,9999)}@example.com",
        "password": "testpass123"
    }

    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=register_data)
        print(f"Status: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            token = data["access_token"]
            print(f"[OK] Registration successful!")
            print(f"Token: {token[:50]}...")
        else:
            print(f"Registration failed, trying login...")
            # If registration fails (user exists), try login
            response = requests.post(f"{BASE_URL}/api/auth/login", json=register_data)
            if response.status_code == 200:
                data = response.json()
                token = data["access_token"]
                print(f"[OK] Login successful!")
                print(f"Token: {token[:50]}...")
            else:
                print(f"[ERROR] {response.text}")
                return
    except Exception as e:
        print(f"[ERROR] {e}")
        return

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # Step 2: Create a task
    print("\n2. Creating a new task...")
    task_data = {
        "title": "Test Task from Python",
        "description": "This is a test task"
    }

    try:
        response = requests.post(f"{BASE_URL}/api/tasks/", json=task_data, headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 201:
            task = response.json()
            task_id = task["id"]
            print(f"[OK] Task created with ID: {task_id}")
            print(f"   Title: {task['title']}")
            print(f"   Status: {task['status']}")
        else:
            print(f"[ERROR] {response.text}")
            return
    except Exception as e:
        print(f"[ERROR] {e}")
        return

    # Step 3: Get all tasks
    print("\n3. Getting all tasks...")
    try:
        response = requests.get(f"{BASE_URL}/api/tasks/", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            tasks = response.json()
            print(f"[OK] Found {len(tasks)} task(s)")
            for task in tasks:
                print(f"   - ID: {task['id']}, Title: {task['title']}, Status: {task['status']}")
        else:
            print(f"[ERROR] {response.text}")
            return
    except Exception as e:
        print(f"[ERROR] {e}")
        return

    # Step 4: Update task (PUT)
    print(f"\n4. Updating task {task_id}...")
    update_data = {
        "title": "Updated Task Title",
        "description": "Updated description"
    }

    try:
        response = requests.put(f"{BASE_URL}/api/tasks/{task_id}", json=update_data, headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            task = response.json()
            print(f"[OK] Task updated!")
            print(f"   New Title: {task['title']}")
            print(f"   New Description: {task['description']}")
        else:
            print(f"[ERROR] {response.text}")
    except Exception as e:
        print(f"[ERROR] {e}")

    # Step 5: Toggle status
    print(f"\n5. Toggling task status...")
    try:
        response = requests.post(f"{BASE_URL}/api/tasks/{task_id}/toggle", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            task = response.json()
            print(f"[OK] Status toggled!")
            print(f"   New Status: {task['status']}")
        else:
            print(f"[ERROR] {response.text}")
    except Exception as e:
        print(f"[ERROR] {e}")

    # Step 6: Delete task
    print(f"\n6. Deleting task {task_id}...")
    try:
        response = requests.delete(f"{BASE_URL}/api/tasks/{task_id}", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 204:
            print(f"[OK] Task deleted!")
        else:
            print(f"[ERROR] {response.text}")
    except Exception as e:
        print(f"[ERROR] {e}")

    # Step 7: Verify deletion
    print("\n7. Verifying deletion...")
    try:
        response = requests.get(f"{BASE_URL}/api/tasks/", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            tasks = response.json()
            print(f"[OK] Current task count: {len(tasks)}")
        else:
            print(f"[ERROR] {response.text}")
    except Exception as e:
        print(f"[ERROR] {e}")

    print("\n" + "=" * 50)
    print("All API tests completed!")
    print("=" * 50)

if __name__ == "__main__":
    test_apis()
