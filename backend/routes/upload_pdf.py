from fastapi import APIRouter, File, UploadFile, HTTPException
from utils import get_pdf_text, get_text_chunks, get_vector_store
import shutil
import traceback
import os

router = APIRouter()

@router.post("/upload_pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    # Use /tmp/ for temporary file storage (Render-compatible)
    upload_directory = "/tmp/uploaded_files"
    os.makedirs(upload_directory, exist_ok=True)

    # Clear any existing files in the upload directory
    for filename in os.listdir(upload_directory):
        file_path = os.path.join(upload_directory, filename)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(f"Error deleting file {file_path}: {e}")

    # Save the uploaded PDF
    file_location = os.path.join(upload_directory, file.filename)
   try:
    with open(file_location, "wb") as f:
        f.write(await file.read())
except Exception as e:
    traceback.print_exc()
    raise HTTPException(status_code=500, detail=f"Error saving PDF: {e}")


    # Process the PDF
   try:
    raw_text = get_pdf_text(file_location)
    text_chunks = get_text_chunks(raw_text)
    get_vector_store(text_chunks)
except Exception as e:
    traceback.print_exc()  # 👈 This prints full error to the Render logs
    raise HTTPException(status_code=500, detail=f"Error processing PDF: {e}")
    return {"info": f"File '{file.filename}' uploaded and processed successfully"}
