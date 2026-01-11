from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import os

# Setup Chrome options
chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--window-size=512,512')

# Create driver
driver = webdriver.Chrome(options=chrome_options)

# Navigate to the HTML file
file_path = 'file:///d:/Project/VibeCoding1/icon_gen_simple_house.html'
driver.get(file_path)

# Wait for page to load
time.sleep(2)

# Set window size precisely
driver.set_window_size(512, 512)

# Take screenshot
driver.save_screenshot('d:/Project/VibeCoding1/public/icon-v2-512.png')

# Resize for 192x192
driver.set_window_size(192, 192)
time.sleep(1)
driver.save_screenshot('d:/Project/VibeCoding1/public/icon-v2-192.png')

driver.quit()
print("Screenshots saved successfully!")
