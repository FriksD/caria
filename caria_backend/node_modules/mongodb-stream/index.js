var MongoClient = require('mongodb').MongoClient,
  util = require('util'),
  stream = require('stream');

function MongoStream(opts) {
  stream.Writable.call(this, opts);
  
  if (!opts) { opts = {}; }
  var self = this;
  self._index = 0;
  self._max = opts.max || 1000000;
  self._db = opts.databaseUri || "mongodb://localhost/mongostream";
  self._collection = opts.collection || "mongostream";
}
util.inherits(MongoStream, stream.Writable);

MongoStream.prototype.init = function (cb) {
  var self = this;
  
  MongoClient.connect(self._db, function (err, db) {
    if (err) { return cb(err); }
    self._mongo = db;
    return cb(null, self);
  });
};

MongoStream.prototype._write = function (chunk, encoding, cb) {
  var self = this;
  if (self._index >= self._max) { self.end("\n"); return cb(false); }
  try {
    var data = JSON.parse(chunk.toString());
  } catch (e) {
    console.log(e);
    return cb(false);
  }
  
  var collection = self._mongo.collection(self._collection);
  collection.insert(data, function (err, docs) {
    if (err) { return cb(err); }
    
    self._index += 1;
    if (self._index >= self._max) { return self.end("\n"); }
    return cb(null);
  });
};

exports = module.exports = MongoStream;