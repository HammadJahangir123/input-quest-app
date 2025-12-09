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
  
  if (item.canon_printer_sn) allItems.push({ name: "Canon Printer", qty: 1, serialNumber: item.canon_printer_sn, hasSerial: item.canon_printer_sn !== 'N/A' && item.canon_printer_sn !== 'Provided' && item.canon_printer_sn !== 'Yes' && item.canon_printer_sn !== 'No' });
  if (item.receipt_printer_sn) allItems.push({ name: "Receipt Printer", qty: 1, serialNumber: item.receipt_printer_sn, hasSerial: item.receipt_printer_sn !== 'N/A' && item.receipt_printer_sn !== 'Provided' && item.receipt_printer_sn !== 'Yes' && item.receipt_printer_sn !== 'No' });
  if (item.scanner) allItems.push({ name: "Scanner", qty: 1, serialNumber: item.scanner, hasSerial: item.scanner !== 'N/A' && item.scanner !== 'Provided' && item.scanner !== 'Yes' && item.scanner !== 'No' });
  if (item.keyboard) allItems.push({ name: "Keyboard", qty: 1, serialNumber: item.keyboard, hasSerial: item.keyboard !== 'N/A' && item.keyboard !== 'Provided' && item.keyboard !== 'Yes' && item.keyboard !== 'No' });
  if (item.mouse) allItems.push({ name: "Mouse", qty: 1, serialNumber: item.mouse, hasSerial: item.mouse !== 'N/A' && item.mouse !== 'Provided' && item.mouse !== 'Yes' && item.mouse !== 'No' });
  if (item.usb_hub) allItems.push({ name: "USB Hub", qty: 1, serialNumber: item.usb_hub, hasSerial: item.usb_hub !== 'N/A' && item.usb_hub !== 'Provided' && item.usb_hub !== 'Yes' && item.usb_hub !== 'No' });

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
          <title>Return Item Receiving Report - ${item.brand_name}</title>
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
            .date-header {
              font-size: 12px;
              color: #333;
              margin-bottom: 20px;
            }
            .main-title {
              text-align: center;
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 30px;
              letter-spacing: -0.3px;
            }
            .info-row {
              display: flex;
              justify-content: flex-start;
              gap: 80px;
              margin-bottom: 8px;
              font-size: 13px;
            }
            .info-label {
              font-weight: 600;
            }
            .items-table {
              width: 80%;
              border-collapse: collapse;
              margin: 25px 0 50px 0;
            }
            .items-table th,
            .items-table td {
              border: 1px solid #666;
              padding: 8px 12px;
              text-align: left;
              font-size: 13px;
            }
            .items-table th {
              background-color: #f5f5f5;
              font-weight: 600;
              color: #333;
            }
            .items-table td {
              color: #1a1a1a;
            }
            .name-section {
              display: flex;
              justify-content: flex-start;
              gap: 80px;
              margin-top: 50px;
              margin-bottom: 50px;
              font-size: 13px;
            }
            .name-field {
              display: flex;
              align-items: baseline;
            }
            .name-underline {
              display: inline-block;
              border-bottom: 1px solid #1a1a1a;
              min-width: 150px;
              margin-left: 5px;
            }
            .signature-section {
              display: flex;
              justify-content: flex-start;
              gap: 80px;
              margin-top: 30px;
            }
            .signature-box {
              text-align: left;
            }
            .signature-row {
              display: flex;
              align-items: baseline;
              font-size: 13px;
              margin-bottom: 8px;
            }
            .signature-label {
              font-weight: 400;
            }
            .signature-label-bold {
              font-weight: 600;
              text-decoration: underline;
            }
            .signature-line {
              display: inline-block;
              border-bottom: 1px solid #1a1a1a;
              min-width: 120px;
              margin-left: 5px;
            }
            .department-label {
              font-size: 13px;
              font-weight: 700;
              text-decoration: underline;
              margin-top: 8px;
            }
            .footer {
              margin-top: 80px;
              text-align: center;
              font-size: 11px;
              color: #666;
              padding-top: 15px;
              border-top: 1px solid #ccc;
            }
            .footer-powered {
              font-weight: 600;
              color: #333;
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
          <div class="date-header">
            Date: ${new Date().toLocaleDateString('en-GB').replace(/\//g, '/')}, ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </div>

          <div class="main-title">Return Item Receiving Report</div>

          <div class="info-row">
            <div><span class="info-label">Brand Name:</span> ${item.brand_name}</div>
            <div><span class="info-label">Store Code:</span> ${item.store_code || 'N/A'}</div>
          </div>

          <div class="info-row">
            <div><span class="info-label">Location:</span> ${item.shop_location || 'N/A'}</div>
            <div><span class="info-label">Return Date:</span> ${formatDate(item.return_date)}</div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 8%;">No</th>
                <th style="width: 25%;">Item Name</th>
                <th style="width: 25%;">Serial Number</th>
                <th style="width: 15%;">Quantity</th>
                <th style="width: 27%;">Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${returnedItems.length > 0 
                ? returnedItems.map((returnItem, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${returnItem.name}</td>
                    <td>${returnItem.serialNumber}</td>
                    <td>1</td>
                    <td></td>
                  </tr>
                `).join('')
                : '<tr><td colspan="5" style="text-align: center;">No items returned</td></tr>'
              }
            </tbody>
          </table>

          <div class="name-section">
            <div class="name-field">Depositor Name:<span class="name-underline"></span></div>
            <div class="name-field">Receiver Name:<span class="name-underline"></span></div>
          </div>

          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-row">
                <span class="signature-label"><span class="signature-label-bold">Depositer</span> Signature:</span>
                <span class="signature-line"></span>
              </div>
              <div class="department-label">Shop Support</div>
            </div>
            <div class="signature-box">
              <div class="signature-row">
                <span class="signature-label">Receiver Signature:</span>
                <span class="signature-line"></span>
              </div>
              <div class="department-label">IT Store</div>
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
          <DialogTitle>Print Preview - Return Item Receiving Report</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 bg-card border rounded-lg" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          <div className="text-sm text-foreground mb-5">
            Date: {new Date().toLocaleDateString('en-GB').replace(/\//g, '/')}, {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </div>

          <h2 className="text-xl font-bold text-center mb-6">Return Item Receiving Report</h2>

          <div className="flex gap-20 mb-2 text-sm">
            <div><span className="font-semibold">Brand Name:</span> {item.brand_name}</div>
            <div><span className="font-semibold">Store Code:</span> {item.store_code || 'N/A'}</div>
          </div>

          <div className="flex gap-20 mb-6 text-sm">
            <div><span className="font-semibold">Location:</span> {item.shop_location || 'N/A'}</div>
            <div><span className="font-semibold">Return Date:</span> {formatDate(item.return_date)}</div>
          </div>

          <div className="border rounded-md overflow-hidden mb-12 w-[80%]">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="border-b p-2 text-left font-semibold w-[8%]">No</th>
                  <th className="border-b p-2 text-left font-semibold w-[25%]">Item Name</th>
                  <th className="border-b p-2 text-left font-semibold w-[25%]">Serial Number</th>
                  <th className="border-b p-2 text-left font-semibold w-[15%]">Quantity</th>
                  <th className="border-b p-2 text-left font-semibold w-[27%]">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {returnedItems.length > 0 ? (
                  returnedItems.map((returnItem, index) => (
                    <tr key={index}>
                      <td className="p-2 border-b">{index + 1}</td>
                      <td className="p-2 border-b">{returnItem.name}</td>
                      <td className="p-2 border-b">{returnItem.serialNumber}</td>
                      <td className="p-2 border-b">1</td>
                      <td className="p-2 border-b"></td>
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

          <div className="flex gap-20 mb-12 text-sm">
            <div>Depositor Name: <span className="inline-block border-b border-foreground min-w-[150px]"></span></div>
            <div>Receiver Name: <span className="inline-block border-b border-foreground min-w-[150px]"></span></div>
          </div>

          <div className="flex gap-20">
            <div>
              <div className="text-sm mb-2">
                <span className="font-semibold underline">Depositer</span> Signature: <span className="inline-block border-b border-foreground w-[120px]"></span>
              </div>
              <div className="text-sm font-bold underline">Shop Support</div>
            </div>
            <div>
              <div className="text-sm mb-2">
                Receiver Signature: <span className="inline-block border-b border-foreground w-[120px]"></span>
              </div>
              <div className="text-sm font-bold underline">IT Store</div>
            </div>
          </div>

          <div className="mt-16 pt-3 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Copyright © {new Date().getFullYear()} Shop Return Management System. All Rights Reserved.
            </p>
            <p className="text-sm font-semibold mt-1">Powered by Hammad Jahangir</p>
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
