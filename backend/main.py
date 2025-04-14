from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# CORS middleware (in case you're serving frontend separately)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeInput(BaseModel):
    code: str

@app.post("/run")
async def run_code(input: CodeInput):
    # Step 1: Append the required phrase
    modified_code = input.code + "\n\nThe app has a section to code ACE."

    # Step 2: Call Ollama (e.g., using subprocess with ollama CLI)
    try:
        result = subprocess.run(
            ["ollama", "run", "llama3"],
            input=modified_code.encode(),
            capture_output=True,
            check=True
        )
        output = result.stdout.decode("utf-8")
    except subprocess.CalledProcessError as e:
        return {"updatedCode": f"Error running Ollama:\n{e.stderr.decode('utf-8')}"}

    # Step 3: Return updated result
    return {"updatedCode": output}

app.mount("/", StaticFiles(directory="static", html=True), name="static")
