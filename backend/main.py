from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import chromadb
import os
from datetime import datetime

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ChromaDB
chroma_client = chromadb.Client()

class AgentCreate(BaseModel):
    name: str
    description: str
    urls: Optional[List[str]] = []
    isRecursive: bool = False

@app.post("/agents")
async def create_agent(agent: AgentCreate):
    try:
        # Create a new collection for the agent
        collection = chroma_client.create_collection(
            name=f"agent_{agent.name}_{datetime.now().timestamp()}",
            metadata={"description": agent.description}
        )
        
        return {
            "success": True,
            "message": "Agent created successfully",
            "agent": {
                "name": agent.name,
                "description": agent.description
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/agents/{agent_id}/upload")
async def upload_file(agent_id: str, file: UploadFile = File(...)):
    try:
        # Read and process the uploaded file
        contents = await file.read()
        
        # Get the agent's collection
        collection = chroma_client.get_collection(f"agent_{agent_id}")
        
        # Process and store the file contents
        # This is a simplified version - you'll want to add proper text extraction
        collection.add(
            documents=[contents.decode("utf-8")],
            metadatas=[{"source": file.filename}],
            ids=[f"doc_{datetime.now().timestamp()}"]
        )
        
        return {"message": "File uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agents")
async def get_agents():
    try:
        # List all collections (agents)
        collections = chroma_client.list_collections()
        agents = []
        
        for collection in collections:
            agents.append({
                "id": collection.name,
                "name": collection.name.split("_")[1],
                "description": collection.metadata.get("description", "")
            })
        
        return agents
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/agents/{agent_id}")
async def delete_agent(agent_id: str):
    try:
        chroma_client.delete_collection(f"agent_{agent_id}")
        return {"message": "Agent deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)