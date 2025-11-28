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
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 10px;
              color: #333;
            }
            .info-row {
              display: flex;
              margin-bottom: 8px;
            }
            .label {
              font-weight: bold;
              width: 150px;
            }
            .value {
              flex: 1;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            .items-table th {
              background-color: #f5f5f5;
              padding: 10px;
              text-align: left;
              border: 1px solid #ddd;
              font-weight: bold;
              font-size: 14px;
            }
            .items-table td {
              padding: 10px;
              border: 1px solid #ddd;
              font-size: 13px;
            }
            .items-table tr:nth-child(even) {
              background-color: #fafafa;
            }
            .signature-section {
              margin-top: 50px;
              display: flex;
              justify-content: space-between;
            }
            .signature-box {
              width: 45%;
            }
            .signature-line {
              border-top: 1px solid #333;
              margin-top: 50px;
              padding-top: 10px;
              text-align: center;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RETURN ITEM RECEIVING REPORT</h1>
            <p>Shop Return Management System</p>
          </div>

          <div class="section">
            <div class="section-title">Store Information</div>
            <div class="info-row">
              <span class="label">Brand Name:</span>
              <span class="value">${item.brand_name}</span>
            </div>
            <div class="info-row">
              <span class="label">Store Code:</span>
              <span class="value">${item.store_code || "N/A"}</span>
            </div>
            <div class="info-row">
              <span class="label">Shop Location:</span>
              <span class="value">${item.shop_location || "N/A"}</span>
            </div>
            <div class="info-row">
              <span class="label">Return Date:</span>
              <span class="value">${new Date(item.return_date).toLocaleDateString()}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Items Returned</div>
            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 10%;">No.</th>
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
          </div>

          ${item.remark ? `
          <div class="section">
            <div class="section-title">Remarks</div>
            <div class="value">${item.remark}</div>
          </div>
          ` : ''}

          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line">
                ${item.receiver_signature || ''}
                <br/>
                Shop Manager Signature
              </div>
            </div>
            <div class="signature-box">
              <div class="signature-line">
                <br/>
                Warehouse Receiver Signature
              </div>
            </div>
          </div>

          <div class="footer">
            <p>This is an automatically generated receiving report</p>
            <p>Report ID: ${item.id}</p>
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
