from pynput import keyboard
import asyncio
import websockets
from websockets.asyncio.server import serve
import json

connected_clients = set()

async def handler(websocket):
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            print(f"Server received: {message}")
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        connected_clients.remove(websocket)

def on_press(key):
    try:
        key_data = {'type': 'keyboard', 'event': 'press', 'key': key.char}
    except AttributeError:
        key_data = {'type': 'keyboard', 'event': 'press', 'key': key.name}
    if key_data['key'] == None:
        key_data['key'] = 'fn'
    send_data(key_data)
def on_release(key):
    try:
        key_data = {'type': 'keyboard', 'event': 'release', 'key': key.char}
        
    except AttributeError:
        key_data = {'type': 'keyboard', 'event': 'release', 'key': key.name}
    if key_data['key'] == None:
        key_data['key'] = 'fn'
    send_data(key_data)

def send_data(data):
    if connected_clients:
        message = json.dumps(data)
        for client in connected_clients:
            asyncio.run(client.send(message))

async def main():
    start_server = websockets.serve(handler, "127.0.0.1", 8001)
        # Collect events until released
    with keyboard.Listener(
        on_press=on_press,
        on_release=on_release) as listener:
        await start_server
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())