const io = require('socket.io-client');
const { server } = require('../../index'); // Adjust the path if necessary

describe('Socket.io connection', () => {
  let clientSocket;
  let port;

  beforeAll((done) => {
    server.listen(() => {
      port = server.address().port;
      clientSocket = io.connect(`http://localhost:${port}`, {
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true,
        transports: ['websocket'],
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll((done) => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    server.close(done);
  });

  test('should connect to socket.io', (done) => {
    expect(clientSocket.connected).toBe(true);
    done();
  });

  test('should receive a message from server', (done) => {
    clientSocket.once('message', (msg) => {
      expect(msg).toBe('Hello from server');
      //done();
    });
    // Emit the message after connection
    clientSocket.emit('message', 'Hello from server');
  });

  test('should join and leave a room', (done) => {
    const room = 'testRoom';
    clientSocket.emit('joinRoom', room);
    clientSocket.emit('leaveRoom', room);
    // Add assertions if your server emits a response when joining or leaving a room
    done();
  });

  test('should handle disconnect', (done) => {
    clientSocket.once('disconnect', () => {
      expect(clientSocket.connected).toBe(false);
      done();
    });
    clientSocket.disconnect();
  });
});
