import pdfplumber
import re
import json
import sys

def extract_fields(pdf_path):
    extracted_data = {
        "Name": "",
        "Phone": "",
        "Address": "",
        "Role": ""
    }
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            full_text = ""
            for page in pdf.pages:
                full_text += page.extract_text() + "\n"
        
        # Remove extra whitespaces
        full_text = re.sub(r'\s+', ' ', full_text).strip()

        # Extract fields based on labels
        name_match = re.search(r"Name\s*[:\-]?\s*(.+?)(?=Phone|Address|Role|$)", full_text, re.IGNORECASE)
        phone_match = re.search(r"Phone\s*[:\-]?\s*(.+?)(?=Name|Address|Role|$)", full_text, re.IGNORECASE)
        address_match = re.search(r"Address\s*[:\-]?\s*(.+?)(?=Name|Phone|Role|$)", full_text, re.IGNORECASE)
        role_match = re.search(r"Role\s*[:\-]?\s*(.+?)(?=Name|Phone|Address|$)", full_text, re.IGNORECASE)

        if name_match:
            extracted_data["Name"] = name_match.group(1).strip()
        if phone_match:
            extracted_data["Phone"] = phone_match.group(1).strip()
        if address_match:
            extracted_data["Address"] = address_match.group(1).strip()
        if role_match:
            extracted_data["Role"] = role_match.group(1).strip()

    except Exception as e:
        print(f"Error extracting data: {e}", file=sys.stderr)

    return extracted_data

if __name__ == "__main__":
    pdf_path = sys.argv[1]
    extracted_data = extract_fields(pdf_path)
    print(json.dumps(extracted_data))
