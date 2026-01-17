import * as FileSystem from "expo-file-system/legacy";
import { getInfoAsync } from "expo-file-system/legacy";

const FILE_PATH = FileSystem.documentDirectory + "payment.json";

/* -------------------- TYPES -------------------- */

export type PaymentMethods = {
  cash: boolean;
  card: boolean;
  upi: boolean;
  netBanking: boolean;
  wallet: boolean;
  cheque: boolean;
};

export type BankDetails = {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  branch: string;
};

export type PaymentSettings = {
  methods: PaymentMethods;
  currency: string;
  taxRate: number;
  paymentTerms: number;
  lateFee: number;
  allowPartialPayment: boolean;
  autoGenerateInvoice: boolean;
  bankDetails: BankDetails;
};

/* -------------------- DEFAULT -------------------- */

const defaultPayment: PaymentSettings = {
  methods: {
    cash: true,
    card: true,
    upi: true,
    netBanking: false,
    wallet: true,
    cheque: false,
  },
  currency: "INR",
  taxRate: 18,
  paymentTerms: 30,
  lateFee: 5,
  allowPartialPayment: true,
  autoGenerateInvoice: true,
  bankDetails: {
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    ifsc: "",
    branch: "",
  },
};

/* -------------------- INIT -------------------- */

export const initPaymentFile = async () => {
  const info = await getInfoAsync(FILE_PATH);
  if (!info.exists) {
    await FileSystem.writeAsStringAsync(
      FILE_PATH,
      JSON.stringify(defaultPayment)
    );
  }
};

/* -------------------- GET -------------------- */

export const getPaymentSettings = async (): Promise<PaymentSettings> => {
  await initPaymentFile();
  const data = await FileSystem.readAsStringAsync(FILE_PATH);
  return JSON.parse(data);
};

/* -------------------- SAVE -------------------- */

export const savePaymentSettings = async (
  settings: PaymentSettings
) => {
  await FileSystem.writeAsStringAsync(
    FILE_PATH,
    JSON.stringify(settings)
  );
};
