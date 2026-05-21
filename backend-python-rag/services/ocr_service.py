import pdfplumber
import pytesseract
import io
import re

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extracts text from a PDF. If the PDF is scanned (no text layer),
    falls back to Tesseract OCR to extract text from the images.
    """
    if not file_bytes or len(file_bytes) < 10:
        raise ValueError("The uploaded PDF file is empty or corrupted.")

    # Find the start of the PDF header (handles leading junk bytes)
    pdf_start = file_bytes.find(b"%PDF-")
    if pdf_start == -1:
        raise ValueError("Invalid PDF format: Missing %PDF- header signature.")

    if pdf_start > 0:
        file_bytes = file_bytes[pdf_start:]

    text = ""
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                # Try to extract native text first
                page_text = page.extract_text()
                
                # If little to no text is found, it's likely a scanned PDF
                if not page_text or len(page_text.strip()) < 20:
                    try:
                        # Convert the page to an image and run OCR
                        # lang="eng+hin" supports both English and Hindi OCR
                        im = page.to_image(resolution=300).original
                        page_text = pytesseract.image_to_string(im, lang="eng+hin")
                    except Exception as e:
                        print(f"OCR processing failed for a page: {e}")
                        # Keep going even if one page fails
                        page_text = ""
                
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        raise Exception(f"Failed to process PDF: {str(e)}")
        
    return clean_text(text)

def clean_text(text: str) -> str:
    """
    Cleans up the extracted text by removing excessive whitespace
    and malformed line breaks often found in PDFs.
    """
    # Replace multiple newlines with a single newline
    text = re.sub(r'\n+', '\n', text)
    # Replace multiple spaces with a single space
    text = re.sub(r' +', ' ', text)
    return text.strip()
