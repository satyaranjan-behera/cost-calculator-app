import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { getInfoAsync } from "expo-file-system/legacy";

/* -------------------- TYPES -------------------- */

export type PDFServiceItem = {
  service: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type PDFHistoryItem = {
  id: string;
  uri: string;
  createdAt: string;
  services: PDFServiceItem[];
  subtotal: number;
  multiplier: number;
  grandTotal: number;
};

/* -------------------- FILE CONFIG -------------------- */

const FILE_PATH =
  FileSystem.documentDirectory + "cost-calculator-pdf.json";

/* -------------------- INIT FILE -------------------- */

const defaultHistory: PDFHistoryItem[] = [];

export const initialPDFFile = async () => {
  const fileInfo = await getInfoAsync(FILE_PATH);

  if (!fileInfo.exists) {
    await FileSystem.writeAsStringAsync(
      FILE_PATH,
      JSON.stringify(defaultHistory)
    );
  }
};

/* -------------------- READ HISTORY -------------------- */

export const getPDFHistory = async (): Promise<PDFHistoryItem[]> => {
  await initialPDFFile();
  const data = await FileSystem.readAsStringAsync(FILE_PATH);
  return JSON.parse(data);
};

/* -------------------- SAVE HISTORY -------------------- */

const savePDFHistory = async (history: PDFHistoryItem[]) => {
  await FileSystem.writeAsStringAsync(
    FILE_PATH,
    JSON.stringify(history)
  );
};

/* -------------------- HTML GENERATOR -------------------- */

const generateHTML = (
  services: PDFServiceItem[],
  subtotal: number,
  multiplier: number,
  grandTotal: number
) => {
  const rows = services
    .map(
      (s) => `
      <tr>
        <td>${s.service}</td>
        <td>₹${s.price.toFixed(2)}</td>
        <td>${s.quantity}</td>
        <td>₹${s.lineTotal.toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 24px; }
          h2 { text-align: center; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td {
            border: 1px solid #e5e7eb;
            padding: 10px;
            text-align: center;
          }
          th { background-color: #f8fafc; }
          .row {
            display: flex;
            justify-content: space-between;
            margin-top: 12px;
            font-size: 16px;
          }
          .grand {
            font-size: 20px;
            font-weight: bold;
            margin-top: 16px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
          }
        </style>
      </head>

      <body>
        <h2>Cost Calculator Summary</h2>

        <table>
          <tr>
            <th>Service</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
          ${rows}
        </table>

        <div class="row">
          <span>Subtotal</span>
          <span>₹${subtotal.toFixed(2)}</span>
        </div>

        <div class="row">
          <span>Multiplier</span>
          <span>${multiplier}x</span>
        </div>

        <div class="row grand">
          <span>Grand Total</span>
          <span>₹${grandTotal.toFixed(2)}</span>
        </div>

        <div class="footer">
          Generated on ${new Date().toLocaleDateString()}
        </div>
      </body>
    </html>
  `;
};

/* -------------------- GENERATE PDF (ON BUTTON CLICK) -------------------- */

export const generateCostCalculatorPDF = async (
  services: PDFServiceItem[],
  subtotal: number,
  multiplier: number,
  grandTotal: number
): Promise<PDFHistoryItem> => {
  if (!services.length) {
    throw new Error("No services selected");
  }

  const html = generateHTML(
    services,
    subtotal,
    multiplier,
    grandTotal
  );

  // PDF is generated ONLY here
  const { uri } = await Print.printToFileAsync({ html });

  const history = await getPDFHistory();

  const pdfItem: PDFHistoryItem = {
    id: Date.now().toString(),
    uri,
    createdAt: new Date().toISOString(),
    services,
    subtotal,
    multiplier,
    grandTotal,
  };

  await savePDFHistory([pdfItem, ...history]);

  return pdfItem;
};

/* -------------------- SHARE PDF -------------------- */

export const sharePDF = async (uri: string) => {
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri);
  }
};

/* -------------------- DELETE PDF -------------------- */

export const deletePDF = async (id: string) => {
  const history = await getPDFHistory();
  const updated = history.filter(item => item.id !== id);
  await savePDFHistory(updated);
};
