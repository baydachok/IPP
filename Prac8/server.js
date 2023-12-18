const PROTO_PATH = "./purchaseList.proto";

var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

var phonebookProto = grpc.loadPackageDefinition(packageDefinition);

const { v4: uuidv4 } = require("uuid");

const server = new grpc.Server();
const purchases = [
    {
        id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
        name: "Молоко",
        count: 2,
        purchased: false
    },
    {
        id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
        name: "Мясо",
        count: 1,
        purchased: true
    }
];

server.addService(phonebookProto.PurchaseService.service, {
    getAll: (_, callback) => {
        callback(null, { purchases });
    },
    get: (call, callback) => {
        let purchase = purchases.find(n => n.id == call.request.id);
        if (purchase) {
            callback(null, purchase);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Не найдено"
            });
        }
    },
    insert: (call, callback) => {
        let purchase = call.request;
        purchase.id = uuidv4();
        purchase.purchased = false;
        purchases.push(purchase);
        callback(null, purchase);
    },
    update: (call, callback) => {
        let existingPurchase = purchases.find(n => n.id == call.request.id);
        if (existingPurchase) {
            existingPurchase.name = call.request.name;
            existingPurchase.count = call.request.count;
            callback(null, existingPurchase);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Не найдено"
            });
        }
    },
    remove: (call, callback) => {
        console.log(call.request.id);
        let existingPurchaseIndex = purchases.findIndex(
            n => n.id == call.request.id
        );
        if (existingPurchaseIndex != -1) {
            purchases.splice(existingPurchaseIndex, 1);
            callback(null, {});
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Не найдено"
            });
        }
    },
    setPurchased: (call, callback) => {
        console.log(call.request.id);
        console.log(call.request.purchased);
        let existingPurchase = purchases.find(n => n.id == call.request.id);
        if (existingPurchase) {
            existingPurchase.purchased = call.request.purchased;
            callback(null, existingPurchase);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Не найдено"
            });
        }
    }
});

server.bindAsync("127.0.0.1:50051", grpc.ServerCredentials.createInsecure(), () => {
    console.log("Сервер запущен по адресу http://127.0.0.1:50051");
    server.start();
});