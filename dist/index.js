"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getTransferTransactions(address, startBlock, endblock) {
    return __awaiter(this, void 0, void 0, function* () {
        const transfers = yield axios_1.default.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endblock}&sort=asc&apikey=YourApiKeyToken`);
        let valueTransfers;
        if (transfers.data && Array.isArray(transfers.data.result)) {
            valueTransfers = transfers.data.map((transaction) => {
                if (transaction.value !== "0" &&
                    (transaction.to == address || transaction.from == address)) {
                    return transaction;
                }
            });
            console.log(valueTransfers);
        }
        return valueTransfers;
    });
}
getTransferTransactions(process.env.ADDRESS, Number(process.env.STARTBLOCK), Number(process.env.ENDBLOCK));
//# sourceMappingURL=index.js.map