const http = require('http');
const { initializeSocket } = require('../services/socketService');
const io = require('socket.io-client');
const assert = require('assert');

describe('Socket Service', () => {
    let server, socket;

    // Start the server and initialize the WebSocket connection before all tests
    before((done) => {
        server = http.createServer();
        initializeSocket(server, { origin: '*' });
        server.listen(3000, () => {
            socket = io('http://localhost:3000'); // Initialize the WebSocket client
            socket.on('connect', () => {
                console.log('WebSocket connected for tests');
                done();
            });
        });
    });

    // Close the server and disconnect the WebSocket after all tests
    after((done) => {
        socket.disconnect(); // Disconnect the WebSocket client
        server.close(() => {
            console.log('WebSocket and server closed after tests');
            done();
        });
    });

    it('should connect to the socket service', (done) => {
        assert.ok(socket.connected); // Ensure the socket is connected
        done();
    });

    it('should allow a user to join a room', (done) => {
        const ideaId = 'testRoom';
        const userId = 'user123';

        socket.emit('joinRoom', { ideaId, userId });

        socket.on('joinedRoom', (data) => {
            assert.strictEqual(data.ideaId, ideaId);
            assert.strictEqual(data.userId, userId);
            done();
        });
    });

    it('should send and receive messages', (done) => {
        const testMessage = 'Hello, World!';
        
        socket.on('message', (message) => {
            assert.strictEqual(message, testMessage);
            done();
        });

        socket.on('directMessage', (message) => {
            assert.strictEqual(message, testMessage);
            done();
        });

        socket.emit('message', testMessage);
    });

    it('should handle disconnection', (done) => {
        // Simulate disconnection and ensure the socket is properly disconnected
        socket.on('disconnect', () => {
            assert.ok(!socket.connected);
            done();
        });

        socket.disconnect();
    });
});