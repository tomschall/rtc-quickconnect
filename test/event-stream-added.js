var test = require('tape');
var connections = [];
var media = require('rtc-media');
var localStream;

require('cog/logger').enable('rtc-quickconnect');

test('capture stream', function(t) {
  t.plan(1);

  media()
    .on('error', t.ifError.bind(t))
    .once('capture', function(stream) {
      t.ok(localStream = stream, 'got stream');
    });
});

test('initialize connections', function(t) {
  connections = require('./helpers/connect')(t.test.bind(t), 'stream:added tests', {
    prep0: function(subtest, conn) {
      subtest.plan(1);
      conn.addStream(localStream);
      subtest.pass('added stream to connection:0');
    }
  });
});

test('connection:1 trigger stream:added', function(t) {
  t.plan(2);
  connections[1].once('stream:added', function(id, label, stream) {
    t.ok(stream instanceof MediaStream, 'got stream');
    t.equal(label, 'main', 'label == main');
  });
});