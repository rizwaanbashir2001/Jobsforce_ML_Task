# Jobsforce Project Solution

## Overview
This project involves building a system to extract specific details (e.g., Name, Phone Number, Address) from a PDF and populate them automatically into a frontend application. The backend is implemented using Node.js and Python, with data extraction handled using `pdfplumber`. The frontend is built using React, and the entire solution is deployed on AWS.

---

## Solution Components

### 1. **PDF Parsing and Data Extraction**
#### Library Used: `pdfplumber`
- **Why pdfplumber?** It provides fine-grained control over PDF text extraction and works well with structured and unstructured data.
- **Implementation:**
  - Extract raw text from the PDF.
  - Clean and preprocess the extracted text to ensure accurate parsing.
  - Extract fields such as `Name`, `Phone`, `Address`, and `Role` using regular expressions.

#### Code Example (Python):
```python
import pdfplumber
import re

def extract_details_from_pdf(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        full_text = ''
        for page in pdf.pages:
            full_text += page.extract_text()

        # Remove extra whitespaces
        full_text = re.sub(r'\s+', ' ', full_text).strip()

        # Extract fields based on labels
        name_match = re.search(r"Name\s*[:\-]?\s*(.+?)(?=Phone|Address|Role|$)", full_text, re.IGNORECASE)
        phone_match = re.search(r"Phone\s*[:\-]?\s*(.+?)(?=Name|Address|Role|$)", full_text, re.IGNORECASE)
        address_match = re.search(r"Address\s*[:\-]?\s*(.+?)(?=Name|Phone|Role|$)", full_text, re.IGNORECASE)
        role_match = re.search(r"Role\s*[:\-]?\s*(.+?)(?=Name|Phone|Address|$)", full_text, re.IGNORECASE)

        extracted_data = {
            'name': name_match.group(1) if name_match else '',
            'phone': phone_match.group(1) if phone_match else '',
            'address': address_match.group(1) if address_match else '',
            'role': role_match.group(1) if role_match else ''
        }
        
    return extracted_data
```

---

### 2. **Frontend Integration**
#### Framework Used: `React`
- **Why React?** Its component-based architecture makes it easy to create reusable UI elements.
- **Implementation:**
  - A form with fields for `Name`, `Phone Number`, `Address`, and `Role`.
  - A file upload input to upload PDFs.
  - On upload, call the backend API to process the PDF and auto-fill the fields.

#### Example React Component:
```javascript
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', role: '' });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await axios.post('http://ec2-35-154-240-63.ap-south-1.compute.amazonaws.com:5000/extract', formData);
    setFormData(response.data);
  };

  return (
    <div>
      <h1>Jobsforce PDF Parser</h1>
      <input type="file" onChange={handleFileUpload} />
      <form>
        <label>Name: <input value={formData.name} readOnly /></label>
        <label>Phone: <input value={formData.phone} readOnly /></label>
        <label>Address: <input value={formData.address} readOnly /></label>
        <label>Role: <input value={formData.role} readOnly /></label>
      </form>
    </div>
  );
};

export default App;
```

---

### 3. **Backend Service**
#### Framework Used: `Node.js`
- **Implementation:**
  - Endpoint to handle file uploads.
  - Invoke the Python script for PDF parsing and data extraction.
  - Return extracted data to the frontend.

#### Code Example (Node.js):
```javascript
const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/process-pdf', upload.single('pdf'), (req, res) => {
  const python = spawn('python3', ['extractor.py', req.file.path]);
  let data = '';

  python.stdout.on('data', (chunk) => { data += chunk; });
  python.on('close', () => { res.json(JSON.parse(data)); });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

### 4. **Deployment on AWS**
#### Steps:
1. **Set Up EC2 Instance:**
   - Launch an EC2 instance (Ubuntu).
   - Install Node.js, Python, and required libraries (`npm`, `pip`).

2. **Transfer Code:**
   - Use `scp` to transfer the frontend and backend code to the EC2 instance.

3. **Run Backend with PM2:**
   ```bash
   pm2 start backend/server.js --name "backend"
   ```

4. **Run Frontend with PM2:**
   ```bash
   pm2 start "npm start" --name "frontend" -- start
   ```

5. **Keep Services Running:**
   - Use `pm2 save` and `pm2 startup` to ensure the backend and frontend restart after reboot.

---

## Project Structure
```
Jobsforce/
|-- backend/
|-- |--uploads/
|   |-- server.js
|   |-- extractor.py
|-- frontend/
|   |-- public/
|   |-- src/
|   |-- build/
|-- README.md
```

---

## Deployment Links
- **Frontend:** [http://ec2-35-154-240-63.ap-south-1.compute.amazonaws.com/)
- **Backend API:** [http://ec2-35-154-240-63.ap-south-1.compute.amazonaws.com:5000)

---

## How to Run Locally
1. Clone the repository.
2. Install dependencies:
   ```bash
   cd backend && npm install
   cd frontend && npm install
   ```
3. Start the backend:
   ```bash
   node server.js
   ```
4. Start the frontend:
   ```bash
   npm start
   ```

---

## Conclusion
This solution demonstrates the use of `pdfplumber` for both PDF text extraction and data field detection. It includes a React-based frontend, a Node.js backend, and deployment on AWS for scalability and reliability.

