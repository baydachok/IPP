const PROTO_PATH = "../purchaseList.proto"; 

const grpc = require("@grpc/grpc-js"); 
const protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, { 
    keepCase: true, 
    longs: String, 
    enums: String, 
    arrays: true
});

const PurchaseService = grpc.loadPackageDefinition(packageDefinition).PurchaseService; 
const client = new PurchaseService(
    "localhost:50051", 
    grpc.credentials.createInsecure()
); 

module.exports = client; 