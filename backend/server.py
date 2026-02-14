from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI
import fitz
#import cv2
from serpapi import GoogleSearch
import requests
#import pytesseract
import json
import sqlite3
import hashlib

app = Flask(__name__, static_url_path='/static', static_folder='static')
CORS(app) 

STATIC_FOLDER = os.path.join(os.getcwd(), "static")
os.makedirs(STATIC_FOLDER, exist_ok=True)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

KEYWORDS = [
    "voltage",
    "vcc",
    "current consumption",
    "pinout",
    "i2c",
    "scl",
    "sda",
    "absolute maximum ratings"
]

conn = sqlite3.connect("/var/data/users.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    salt BLOB NOT NULL,
    hashed_password BLOB NOT NULL
)
""")
conn.commit()

@app.route('/upload-image', methods=['POST'])
def upload_image():
    try:
        print("Received request to upload image")
        data = request.get_json(force=True)
        img_data_url = data.get('imageBase64', '')

        if not img_data_url.startswith("data:image"):
            raise ValueError("Invalid image data URL")

        response = client.chat.completions.create(
            model="gpt-4o", 
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Given this image of a component, return only with the matching component name (e.g, capacitor, led, IC etc.) and its model if able. The response should look like this: Microcontroller:Uno R3. If model is unknown, respond 'unknown'. If it is not a component, respond 'null': "},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": img_data_url
                            },
                        },
                    ],
                }
            ],
        )

        result = response.choices[0].message.content.strip()
        print("Result:", result)
        component = result.split(':', 1)
        return jsonify({"component_name": component[0], "model": component[1]})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def check_name(titles):
    return {"component_name": titles[0] if titles else "Unknown"}

@app.route('/check-ai', methods=['POST'])
def CheckAI():
    try:
        data = request.json
        prompt = data.get('prompt')

        response = client.chat.completions.create(
            model="gpt-4.1",
            temperature=0.2,
            top_p=0.2,
            messages=[
                {"role": "system", "content": 'You are a senior engineer working out the wiring of components for someones project. Return ONLY valid JSON. The JSON must follow this structure exactly: {"components": [{"name": "string","type": "string","pins": {"PIN_NAME": "DESCRIPTION"}}]}. Also add a section called "code" with the code if it is necessary'},
                {"role": "user", "content": prompt}
            ]
        )

        print(response.choices[0].message.content)

        return response.choices[0].message.content

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/search-datasheet-information', methods=['POST'])
def SearchDatasheetInformation():
    serpapi_api_key = os.getenv("SERPAPI_API_KEY")
    print(serpapi_api_key)
    data = request.json
    componentToSearch = data.get('componentName')
    params = {
        "engine": "google",
        "q": f"{componentToSearch} datasheet filetype:pdf",
        "google_domain": "google.com",
        "hl": "en",
        "gl": "us",
        "api_key": serpapi_api_key
    }
    search = GoogleSearch(params)
    results = search.get_dict()
    organic_results = results.get("organic_results")

    if not organic_results:
        return {"result":"no results found", "absoluteMaximumRatings": "", "sda": "", "scl": "", "i2c": "", "currentConsumption": "", "vcc": "", "voltage": ""}

    link = organic_results[0].get("link")

    if "pdf" in link:
        filename = link.split("/")[-1].split("?")[0]
        filepath = os.path.join("static", filename)

        index = link.find(".pdf")
        link = link[:index + 4]

        print(f"Downloading: {link}")

        response = requests.get(link, timeout=60)
        with open(filepath, "wb") as f:
            f.write(response.content)

        extractPDFTextAndImages(filepath)
        toReturn = SummarizeExtractedInfo()
        os.remove(filepath)
        return toReturn

#def ocr_image(image_path):
#    img = cv2.imread(image_path)
#    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

#    gray = cv2.adaptiveThreshold(
#        gray, 255,
#        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
#        cv2.THRESH_BINARY,
#        31, 2
#    )

#    return pytesseract.image_to_string(gray, config="--psm 6")


def extractPDFTextAndImages(path):
    results = []
    doc = fitz.open(path)

    for page_num in range(len(doc)):
        page = doc[page_num]

        text = page.get_text()

        #if not text.strip():
        #    pix = page.get_pixmap(dpi=300)
        #    img_path = os.path.join("static", f"page_{page_num+1}.png")
        #    pix.save(img_path)

        #    text = ocr_image(img_path)

        lines = text.split("\n")
        for i, line in enumerate(lines):
            if any(k in line.lower() for k in KEYWORDS):
                block = "\n".join(lines[i-2:i+2])
                results.append(f"[Page {page_num+1}]\n{block}\n")
                print(f"[FOUND] Page {page_num+1}")

        #for img_i, img in enumerate(page.get_images(full=True)):
        #    xref = img[0]
        #    base = doc.extract_image(xref)
        #    img_bytes = base["image"]
        #    ext = base["ext"]

        #    img_path = os.path.join(
        #        "static",
        #        f"page{page_num+1}_img{img_i+1}.{ext}"
        #    )

        #    with open(img_path, "wb") as f:
        #        f.write(img_bytes)

    output_text = os.path.join("static", "extracted_info.txt")
    with open(output_text, "w", encoding="utf-8") as f:
        f.write("\n".join(results))
    
def SummarizeExtractedInfo():
    try:
        with open("static/extracted_info.txt", "r", encoding="utf-8") as f:
            prompt = f.read()

        response = client.chat.completions.create(
            model="gpt-4.1",
            temperature=0.2,
            top_p=0.2,
            messages=[
                {"role": "system", "content": 'You are a senior engineer summarizing a datasheet for a beginners project. Return ONLY valid JSON. The JSON must follow this structure exactly: {"summary": {},"voltage": {},"vcc": {},"currentConsumption": {},"i2c": {},"scl": {},"sda": {},"absoluteMaximumRatings": {}}. Do not include anything chatty or not key information. The following text is extracted from a datasheet and contains certain keywords thoughout: ' + prompt},
                {"role": "user", "content": prompt}
            ]
        )

        print(response.choices[0].message.content)
        data = json.loads(response.choices[0].message.content)
        return jsonify(data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
def generate_salt():
    return os.urandom(16)

def hash_password(password, salt):
    return hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)

def verify_password(stored_hash, stored_salt, password_attempt):
    attempt_hash = hash_password(password_attempt, stored_salt)
    return attempt_hash == stored_hash

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        print("Error: Email already registered.")
        return {"email": "", "error": "Email already registered."}
    
    salt = generate_salt()
    hashed_password = hash_password(password, salt)
    cursor.execute(
        "INSERT INTO users (email, salt, hashed_password) VALUES (?, ?, ?)",
        (email, salt, hashed_password)
    )
    conn.commit()
    print(f"User {email} registered successfully!")
    return {"email": email, "error": ""}

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email_input = data.get('email')
    password = data.get('password')

    cursor.execute(
        "SELECT email, salt, hashed_password FROM users WHERE email = ?", 
        (email_input,)
    )
    row = cursor.fetchone()

    if not row:
        return jsonify({"error": "No account with that email"}), 404

    db_email, salt, stored_hash = row

    if verify_password(stored_hash, salt, password):
        return jsonify({"email": db_email}), 200
    else:
        return jsonify({"error": "Incorrect email or password"}), 401