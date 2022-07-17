"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var ethers_1 = require("ethers");
require("dotenv/config");
var ballotJson = require("../../artifacts/contracts/Ballot.sol/Ballot.json");
// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
var EXPOSED_KEY = "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";
function convertStringArrayToBytes32(array) {
    var bytes32Array = [];
    for (var index = 0; index < array.length; index++) {
        bytes32Array.push(ethers_1.ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}
function main() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var wallet, provider, signer, balanceBN, balance, proposals, ballotFactory, ballotContract;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    wallet = new ethers_1.ethers.Wallet((_a = process.env.PRIVATE_KEY) !== null && _a !== void 0 ? _a : EXPOSED_KEY);
                    console.log("Using address ".concat(wallet.address));
                    provider = new ethers_1.ethers.providers.AlchemyProvider('rinkeby', process.env.API_KEY);
                    signer = wallet.connect(provider);
                    return [4 /*yield*/, signer.getBalance()];
                case 1:
                    balanceBN = _b.sent();
                    balance = Number(ethers_1.ethers.utils.formatEther(balanceBN));
                    console.log("Wallet balance ".concat(balance));
                    if (balance < 0.01) {
                        throw new Error("Not enough ether");
                    }
                    console.log("Deploying Ballot contract");
                    console.log("Proposals: ");
                    proposals = process.argv.slice(2);
                    if (proposals.length < 2)
                        throw new Error("Not enough proposals provided");
                    proposals.forEach(function (element, index) {
                        console.log("Proposal N. ".concat(index + 1, ": ").concat(element));
                    });
                    ballotFactory = new ethers_1.ethers.ContractFactory(ballotJson.abi, ballotJson.bytecode, signer);
                    return [4 /*yield*/, ballotFactory.deploy(convertStringArrayToBytes32(proposals))];
                case 2:
                    ballotContract = _b.sent();
                    console.log("Awaiting confirmations");
                    return [4 /*yield*/, ballotContract.deployed()];
                case 3:
                    _b.sent();
                    console.log("Completed");
                    console.log("Contract deployed at ".concat(ballotContract.address));
                    return [2 /*return*/];
            }
        });
    });
}
main()["catch"](function (error) {
    console.error(error);
    process.exitCode = 1;
});
