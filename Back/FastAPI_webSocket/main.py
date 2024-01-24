from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import uvicorn

app = FastAPI()


@app.get('/')
async def root():
    return {"message": "hi"}


class ConnectionManager:
    def __init__(self):
        self.action_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.action_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.action_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, messge: str):
        for connection in self.action_connections:
            await connection.send_text(messge)


manager = ConnectionManager()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(data)
            await manager.send_personal_message(data, websocket)
            await manager.broadcast(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast("disc")
