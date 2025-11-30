import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface ReturnItem {
  id: string;
  return_date: string;
  brand_name: string;
  store_code: string | null;
  shop_location: string | null;
  canon_printer_sn: string | null;
  receipt_printer_sn: string | null;
  usb_hub: string | null;
  keyboard: string | null;
  mouse: string | null;
  scanner: string | null;
  other_1: string | null;
  other_2: string | null;
  receiver_signature: string | null;
  remark: string | null;
}

interface PrintReceivingProps {
  item: ReturnItem;
}

export const PrintReceiving = ({ item }: PrintReceivingProps) => {
  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    const returnedItems: Array<{ name: string; qty: number; serialNumber: string }> = [];
    
    if (item.canon_printer_sn) returnedItems.push({ name: "Canon Printer", qty: 1, serialNumber: item.canon_printer_sn });
    if (item.receipt_printer_sn) returnedItems.push({ name: "Receipt Printer", qty: 1, serialNumber: item.receipt_printer_sn });
    if (item.usb_hub) returnedItems.push({ name: "USB Hub", qty: 1, serialNumber: item.usb_hub });
    if (item.keyboard) returnedItems.push({ name: "Keyboard", qty: 1, serialNumber: item.keyboard });
    if (item.mouse) returnedItems.push({ name: "Mouse", qty: 1, serialNumber: item.mouse });
    if (item.scanner) returnedItems.push({ name: "Scanner", qty: 1, serialNumber: item.scanner });

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Return Receipt - ${item.brand_name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              color: #000;
              background: #fff;
            }
            .notice {
              margin-bottom: 30px;
              font-size: 14px;
              line-height: 1.6;
            }
            .section-title {
              font-weight: bold;
              font-size: 15px;
              margin-bottom: 15px;
              margin-top: 25px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              margin-bottom: 30px;
            }
            .items-table th,
            .items-table td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
              font-size: 13px;
            }
            .items-table th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .remark-section {
              margin-top: 20px;
              margin-bottom: 30px;
            }
            .remark-label {
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 10px;
            }
            .remark-content {
              min-height: 40px;
              font-size: 13px;
            }
            .status-text {
              margin-top: 20px;
              margin-bottom: 40px;
              font-size: 14px;
            }
            .signature-section {
              display: flex;
              justify-content: space-between;
              margin-top: 50px;
              margin-bottom: 60px;
            }
            .signature-box {
              width: 45%;
            }
            .signature-line {
              margin-bottom: 20px;
            }
            .signature-label {
              display: block;
              margin-bottom: 5px;
              font-size: 13px;
            }
            .signature-input {
              border-bottom: 1px solid #000;
              min-height: 30px;
              margin-bottom: 15px;
            }
            .name-label {
              display: block;
              margin-bottom: 5px;
              font-size: 13px;
            }
            .name-input {
              border-bottom: 1px solid #000;
              min-height: 25px;
              margin-bottom: 10px;
            }
            .role-label {
              font-size: 12px;
              display: block;
            }
            .footer {
              margin-top: 60px;
              text-align: center;
              font-size: 11px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="notice">
            Kindly <strong>format</strong> change the return data "<strong>${formatDate(item.return_date)}</strong>"
          </div>

          <div class="section-title">Item returned</div>
          <div style="border-bottom: 1px solid #000; width: 30px; margin-bottom: 15px;"></div>

          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 10%;">No</th>
                <th style="width: 40%;">Item Name</th>
                <th style="width: 15%;">QTY</th>
                <th style="width: 35%;">Serial Number</th>
              </tr>
            </thead>
            <tbody>
              ${returnedItems.length > 0 
                ? returnedItems.map((item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.qty}</td>
                    <td>${item.serialNumber}</td>
                  </tr>
                `).join('')
                : '<tr><td colspan="4" style="text-align: center;">No items returned</td></tr>'
              }
            </tbody>
          </table>

          <div class="remark-section">
            <div class="remark-label">Remark :</div>
            <div class="remark-content">${item.remark || ''}</div>
          </div>

          <div class="status-text">Shop Closed</div>

          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line">
                <span class="signature-label">Sign</span>
                <div class="signature-input">${item.receiver_signature || ''}</div>
              </div>
              <div>
                <span class="name-label">Name:</span>
                <div class="name-input"></div>
                <span class="role-label">(Shop Support Depositor <span style="color: blue;">Signature</span>)</span>
              </div>
            </div>
            <div class="signature-box">
              <div class="signature-line">
                <span class="signature-label">Sign</span>
                <div class="signature-input"></div>
              </div>
              <div>
                <span class="name-label">Name</span>
                <div class="name-input"></div>
                <span class="role-label">(IT Store Receiver)</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} All Rights Reserved | Powered by <strong>Hammad Jahangir</strong></p>
            <p style="margin-top: 10px; font-size: 10px;">Report ID: ${item.id}</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 w-7 p-0"
      onClick={handlePrint}
      title="Print Receiving Report"
    >
      <Printer className="h-3.5 w-3.5" />
    </Button>
  );
};
