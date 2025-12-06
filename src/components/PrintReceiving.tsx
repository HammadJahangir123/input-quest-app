import { Button } from "@/components/ui/button";
import { Printer, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const allItems: Array<{ name: string; qty: number; serialNumber: string; hasSerial: boolean }> = [];
  
  if (item.canon_printer_sn) allItems.push({ name: "Canon Printer", qty: 1, serialNumber: item.canon_printer_sn, hasSerial: item.canon_printer_sn !== 'N/A' && item.canon_printer_sn !== 'Provided' });
  if (item.receipt_printer_sn) allItems.push({ name: "Receipt Printer", qty: 1, serialNumber: item.receipt_printer_sn, hasSerial: item.receipt_printer_sn !== 'N/A' && item.receipt_printer_sn !== 'Provided' });
  if (item.usb_hub) allItems.push({ name: "USB Hub", qty: 1, serialNumber: item.usb_hub, hasSerial: item.usb_hub !== 'N/A' && item.usb_hub !== 'Provided' });
  if (item.keyboard) allItems.push({ name: "Keyboard", qty: 1, serialNumber: item.keyboard, hasSerial: item.keyboard !== 'N/A' && item.keyboard !== 'Provided' });
  if (item.mouse) allItems.push({ name: "Mouse", qty: 1, serialNumber: item.mouse, hasSerial: item.mouse !== 'N/A' && item.mouse !== 'Provided' });
  if (item.scanner) allItems.push({ name: "Scanner", qty: 1, serialNumber: item.scanner, hasSerial: item.scanner !== 'N/A' && item.scanner !== 'Provided' });

  // Sort: items with actual serial numbers first, then others
  const returnedItems = allItems.sort((a, b) => {
    if (a.hasSerial && !b.hasSerial) return -1;
    if (!a.hasSerial && b.hasSerial) return 1;
    return 0;
  });

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Return Receipt - ${item.brand_name}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              padding: 30px 40px;
              max-width: 800px;
              margin: 0 auto;
              color: #1a1a1a;
              background: #fff;
              font-size: 13px;
              line-height: 1.4;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 20px;
            }
            .header-date {
              font-size: 12px;
              color: #666;
            }
            .main-title {
              text-align: center;
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 20px;
              letter-spacing: -0.3px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px 30px;
              margin-bottom: 20px;
              padding: 12px 16px;
              background: #f8f9fa;
              border-radius: 6px;
            }
            .info-row {
              font-size: 12px;
            }
            .info-label {
              font-weight: 600;
              color: #374151;
            }
            .info-value {
              color: #1a1a1a;
            }
            .section-title {
              font-weight: 600;
              font-size: 13px;
              margin-bottom: 10px;
              color: #374151;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .items-table th,
            .items-table td {
              border: 1px solid #e5e7eb;
              padding: 8px 12px;
              text-align: left;
              font-size: 12px;
            }
            .items-table th {
              background-color: #f3f4f6;
              font-weight: 600;
              color: #374151;
            }
            .items-table td {
              color: #1a1a1a;
            }
            .items-table tr:nth-child(even) {
              background-color: #fafafa;
            }
            .signature-section {
              display: flex;
              justify-content: space-between;
              margin-top: 30px;
              gap: 40px;
            }
            .signature-box {
              flex: 1;
            }
            .signature-title {
              font-weight: 600;
              font-size: 12px;
              margin-bottom: 25px;
              color: #374151;
            }
            .signature-line {
              border-bottom: 1px solid #1a1a1a;
              height: 35px;
              margin-bottom: 8px;
            }
            .signature-label {
              font-size: 11px;
              color: #6b7280;
            }
            .name-line {
              border-bottom: 1px solid #1a1a1a;
              height: 25px;
              margin-top: 20px;
              margin-bottom: 8px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 10px;
              color: #9ca3af;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
            }
            .footer-powered {
              font-weight: 600;
              color: #374151;
              margin-top: 4px;
            }
            @media print {
              body {
                padding: 20px 30px;
              }
              @page {
                size: A4;
                margin: 15mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-date">Date: ${new Date().toLocaleDateString('en-GB')}, ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>

          <div class="main-title">Return Item Receiving Report</div>

          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Brand Name:</span> <span class="info-value">${item.brand_name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Store Code:</span> <span class="info-value">${item.store_code || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Location:</span> <span class="info-value">${item.shop_location || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Return Date:</span> <span class="info-value">${formatDate(item.return_date)}</span>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 8%;">No</th>
                <th style="width: 30%;">Item Name</th>
                <th style="width: 12%;">Quantity</th>
                <th style="width: 30%;">Serial Number</th>
                <th style="width: 20%;">Condition</th>
              </tr>
            </thead>
            <tbody>
              ${returnedItems.length > 0 
                ? returnedItems.map((item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>1</td>
                    <td>${item.serialNumber}</td>
                    <td>Good</td>
                  </tr>
                `).join('')
                : '<tr><td colspan="5" style="text-align: center;">No items returned</td></tr>'
              }
            </tbody>
          </table>

          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-title">Depositor Signature:</div>
              <div class="signature-line"></div>
              <div class="name-line"></div>
              <div class="signature-label">Name: ____________________________</div>
            </div>
            <div class="signature-box">
              <div class="signature-title">Receiver Signature:</div>
              <div class="signature-line"></div>
              <div class="name-line"></div>
              <div class="signature-label">Name: ____________________________</div>
            </div>
          </div>

          <div class="footer">
            <div>Copyright © ${new Date().getFullYear()} Shop Return Management System. All Rights Reserved.</div>
            <div class="footer-powered">Powered by Hammad Jahangir</div>
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          title="Preview Report"
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Print Preview - Return Receipt</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 bg-background border rounded-lg" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          <div className="text-xs text-muted-foreground mb-4">
            Date: {new Date().toLocaleDateString('en-GB')}, {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </div>

          <h2 className="text-xl font-bold text-center mb-5">Return Item Receiving Report</h2>

          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-5 p-3 bg-muted/50 rounded-md text-xs">
            <div><span className="font-semibold">Brand Name:</span> {item.brand_name}</div>
            <div><span className="font-semibold">Store Code:</span> {item.store_code || 'N/A'}</div>
            <div><span className="font-semibold">Location:</span> {item.shop_location || 'N/A'}</div>
            <div><span className="font-semibold">Return Date:</span> {formatDate(item.return_date)}</div>
          </div>

          <div className="border rounded-md overflow-hidden mb-6">
            <table className="w-full text-xs">
              <thead className="bg-muted">
                <tr>
                  <th className="border-b p-2 text-left font-semibold w-[8%]">No</th>
                  <th className="border-b p-2 text-left font-semibold w-[30%]">Item Name</th>
                  <th className="border-b p-2 text-left font-semibold w-[12%]">Quantity</th>
                  <th className="border-b p-2 text-left font-semibold w-[30%]">Serial Number</th>
                  <th className="border-b p-2 text-left font-semibold w-[20%]">Condition</th>
                </tr>
              </thead>
              <tbody>
                {returnedItems.length > 0 ? (
                  returnedItems.map((returnItem, index) => (
                    <tr key={index} className={index % 2 === 0 ? '' : 'bg-muted/30'}>
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{returnItem.name}</td>
                      <td className="p-2">1</td>
                      <td className="p-2">{returnItem.serialNumber}</td>
                      <td className="p-2">Good</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-2 text-center text-muted-foreground">
                      No items returned
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-8">
            <div>
              <div className="font-semibold text-xs mb-5">Depositor Signature:</div>
              <div className="border-b border-foreground h-8 mb-2"></div>
              <div className="border-b border-foreground h-5 mt-4 mb-1"></div>
              <div className="text-xs text-muted-foreground">Name: ____________________________</div>
            </div>
            <div>
              <div className="font-semibold text-xs mb-5">Receiver Signature:</div>
              <div className="border-b border-foreground h-8 mb-2"></div>
              <div className="border-b border-foreground h-5 mt-4 mb-1"></div>
              <div className="text-xs text-muted-foreground">Name: ____________________________</div>
            </div>
          </div>

          <div className="mt-8 pt-3 border-t text-center">
            <p className="text-[10px] text-muted-foreground">
              Copyright © {new Date().getFullYear()} Shop Return Management System. All Rights Reserved.
            </p>
            <p className="text-xs font-semibold mt-1">Powered by Hammad Jahangir</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => { handlePrint(); setOpen(false); }}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
