from fastapi import WebSocket
from typing import List
import json
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"Client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"Client disconnected. Total connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_text(json.dumps(message))

    async def broadcast(self, message: dict):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error broadcasting: {e}")
                disconnected.append(connection)

        for conn in disconnected:
            self.active_connections.remove(conn)

    async def broadcast_transaction_alert(self, transaction: dict):
        await self.broadcast({
            "type": "transaction_alert",
            "data": transaction
        })

    async def broadcast_risk_alert(self, alert: dict):
        await self.broadcast({
            "type": "risk_alert",
            "data": alert
        })
