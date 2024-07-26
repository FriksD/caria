# mongodb-stream
A writable stream that feeds data into mongodb, for use with node >= 0.10.

## Usage
Install mongodb-stream from npm:

    npm install mongodb-stream
    
Anywhere you'd like to stream data into mongodb, you can do it like this:

    var MongoStream = request('mongodb-stream');
    var stream = new MongoSream({
      databaseUri: "mongodb://local/host/test",
      collection: "tweets"
    });
    stream.init(function (err, stream) {
      request(...).pipe(stream);    // the stream writes every instance to mongoDB
    });
