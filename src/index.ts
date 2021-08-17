import dotenv from "dotenv";
import * as fs from "fs";
import { exportToCSV } from "./generateCSV";
import {
  filterTokenTransfers,
  filterTransferTransactions,
  getTokenTransactions,
  getTransferTransactions,
} from "./utils";

dotenv.config();

async function getAllTransfersForAddress() {
  const transferTransactions = await getTransferTransactions(
    process.env.ADDRESS || "",
    Number(process.env.STARTBLOCK),
    Number(process.env.ENDBLOCK)
  );

  const tokenTransfers = await getTokenTransactions(
    process.env.ADDRESS || "",
    Number(process.env.STARTBLOCK),
    Number(process.env.ENDBLOCK)
  );

  const filteredTransferTransactions =
    filterTransferTransactions(transferTransactions);
  const filteredTokenTransactions = filterTokenTransfers(tokenTransfers);
  const finalTransfers = [
    ...filteredTransferTransactions,
    ...filteredTokenTransactions,
  ];

  const csvString: string = exportToCSV(finalTransfers);
  await fs.writeFileSync("./report.csv", csvString);
}

getAllTransfersForAddress().then(() =>
  console.log(
    "CSV Generated Successfully. Saved to report.csv file in project root."
  )
);
