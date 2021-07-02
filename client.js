const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "chat.proto";
const SERVER_URI = "0.0.0.0:50051";

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const client = new protoDescriptor.ChatService(
  SERVER_URI,
  grpc.credentials.createInsecure()
);

const user = "Johnny";
const sendMessageIntervalInMs = 2000;

const chatStream = client.joinChat({ user });

chatStream.on("data", (data) => {
  const { message, user } = data;

  console.log(`New message from ${user}: ${message}`);
});
chatStream.on("error", (err) => {
  console.log(`ERR: ${err}`);
  process.exit(1);
});

let messageNumber = 0;

setInterval(() => {
  client.sendMessage(
    { message: `New message no. ${messageNumber++}`, user },
    (error, response) => {
      if (error) {
        console.error(error);
      }
    }
  );
}, sendMessageIntervalInMs);
