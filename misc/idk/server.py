import socket

# Create a socket               family              type
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# Bind the socket to a specific address and port
server_address = ('10.22.209.178', 12345)  # Use '0.0.0.0' to listen on all available network interfaces
server_socket.bind(server_address)

# Listen for incoming connections
server_socket.listen(5)  # Maximum number of queued connections

print("Server is listening on port 12345...")
while True:
    # Accept a connection from a client
    client_socket, client_address = server_socket.accept()
    print(f"Connection from {client_address}")

    # Handle client communication here
    while True:
        serverInput = input("\nSay something to the client-dude: ")
        client_socket.sendall(b"Server-dude says: ")  # Send data to the client
        client_socket.sendall(serverInput.encode("utf-8"))  # Send data to the client
        client_socket.sendall(b"\nSay something back: ")
        clientInput = client_socket.recv(40)  # Receive data from the client
        if not clientInput:
            break

        print(f"Client-dude says: {clientInput.decode('utf-8')}")

        # Close the client socket
        connection = client_socket.close()

        if not connection:
            break
    print(f"Connection from {client_address} closed")
    
