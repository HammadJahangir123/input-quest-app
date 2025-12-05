import { Button } from "@/components/ui/button";
import { Printer, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface LaptopReturn {
  id: string;
  return_date: string;
  brand: string;
  store_code: string | null;
  location: string | null;
  laptop_model: string;
  serial_number: string;
  has_charger: boolean;
  remark: string | null;
}

interface PrintLaptopReceivingProps {
  item: LaptopReturn;
}

export const PrintLaptopReceiving = ({ item }: PrintLaptopReceivingProps) => {
  const [open, setOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laptop Return Receipt - ${item.brand}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              color: #333;
              background: #fff;
            }
            .header-date {
              font-size: 14px;
              margin-bottom: 30px;
            }
            .main-title {
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .subtitle {
              text-align: center;
              font-size: 16px;
              margin-bottom: 30px;
            }
            .store-info {
              margin-bottom: 30px;
            }
            .store-info-title {
              font-weight: bold;
              margin-bottom: 15px;
              font-size: 15px;
            }
            .info-row {
              margin-bottom: 10px;
              font-size: 14px;
            }
            .info-label {
              font-weight: bold;
            }
            .section-title {
              font-weight: bold;
              font-size: 15px;
              margin-bottom: 15px;
              margin-top: 30px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              margin-bottom: 30px;
            }
            .items-table th,
            .items-table td {
              border: 1px solid #333;
              padding: 10px;
              text-align: left;
              font-size: 13px;
            }
            .items-table th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .charger-status {
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 500;
            }
            .charger-yes {
              background-color: #dcfce7;
              color: #166534;
            }
            .charger-no {
              background-color: #fee2e2;
              color: #991b1b;
            }
            .remark-section {
              margin-top: 25px;
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
              display: inline-block;
              margin-bottom: 5px;
              font-size: 13px;
            }
            .signature-input {
              border-bottom: 1px solid #333;
              min-height: 30px;
              margin-bottom: 15px;
              display: inline-block;
              width: 200px;
              margin-left: 10px;
            }
            .name-label {
              display: inline-block;
              margin-bottom: 5px;
              font-size: 13px;
            }
            .name-input {
              border-bottom: 1px solid #333;
              min-height: 25px;
              margin-bottom: 10px;
              display: inline-block;
              width: 200px;
              margin-left: 10px;
            }
            .role-label {
              font-size: 12px;
              display: block;
              margin-top: 5px;
            }
            .footer {
              margin-top: 60px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            .footer-copyright {
              margin-bottom: 5px;
            }
            .footer-powered {
              font-weight: bold;
              color: #333;
            }
            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header-date">${formatDate(item.return_date)}</div>

          <div class="main-title">Laptop Return Receiving Report</div>
          <div class="subtitle">Shop Return Management System</div>

          <div class="store-info">
            <div class="store-info-title">Laptop Information:</div>
            <div class="info-row">
              <span class="info-label">Brand:</span> ${item.brand}
            </div>
            <div class="info-row">
              <span class="info-label">Store Code:</span> ${item.store_code || 'N/A'}
            </div>
            <div class="info-row">
              <span class="info-label">Location:</span> ${item.location || 'N/A'}
            </div>
            <div class="info-row">
              <span class="info-label">Return Date:</span> ${formatDate(item.return_date)}
            </div>
          </div>

          <div class="section-title">Laptop Details</div>

          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 30%;">Laptop Model</th>
                <th style="width: 35%;">Serial Number</th>
                <th style="width: 35%;">Charger Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${item.laptop_model}</td>
                <td>${item.serial_number}</td>
                <td>
                  <span class="charger-status ${item.has_charger ? 'charger-yes' : 'charger-no'}">
                    ${item.has_charger ? 'With Charger' : 'Without Charger'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="remark-section">
            <div class="remark-label">Remark :</div>
            <div class="remark-content">${item.remark || ''}</div>
          </div>

          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line">
                <span class="signature-label">Sign</span><span class="signature-input"></span>
              </div>
              <div>
                <span class="name-label">Name:</span><span class="name-input"></span>
              </div>
              <span class="role-label">(Shop Support Depositor <span style="text-decoration: underline;">Signature</span>)</span>
            </div>
            <div class="signature-box">
              <div class="signature-line">
                <span class="signature-label">Sign</span><span class="signature-input"></span>
              </div>
              <div>
                <span class="name-label">Name</span><span class="name-input"></span>
              </div>
              <span class="role-label">(IT Store Receiver)</span>
            </div>
          </div>

          <div class="footer">
            <div class="footer-copyright">Copyright &copy; ${new Date().getFullYear()} Shop Return Management System. All Rights Reserved.</div>
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
          <DialogTitle>Print Preview - Laptop Return Receipt</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-8 bg-background border rounded-lg">
          <div className="text-sm text-muted-foreground">{formatDate(item.return_date)}</div>

          <div>
            <h2 className="text-2xl font-bold text-center mb-2">Laptop Return Receiving Report</h2>
            <p className="text-center text-base mb-6">Shop Return Management System</p>
          </div>

          <div className="space-y-3">
            <div className="font-semibold">Laptop Information:</div>
            <div className="space-y-2 text-sm">
              <div><span className="font-semibold">Brand:</span> {item.brand}</div>
              <div><span className="font-semibold">Store Code:</span> {item.store_code || 'N/A'}</div>
              <div><span className="font-semibold">Location:</span> {item.location || 'N/A'}</div>
              <div><span className="font-semibold">Return Date:</span> {formatDate(item.return_date)}</div>
            </div>
          </div>

          <div>
            <div className="font-semibold text-base mb-4 mt-6">Laptop Details</div>

            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="border p-3 text-left w-[30%]">Laptop Model</th>
                    <th className="border p-3 text-left w-[35%]">Serial Number</th>
                    <th className="border p-3 text-left w-[35%]">Charger Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-3">{item.laptop_model}</td>
                    <td className="border p-3">{item.serial_number}</td>
                    <td className="border p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.has_charger 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.has_charger ? 'With Charger' : 'Without Charger'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <div className="font-semibold mb-2">Remark :</div>
            <div className="text-sm min-h-[40px]">{item.remark || ''}</div>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-12">
            <div>
              <div className="mb-4">
                <span className="text-sm">Sign</span>
                <span className="border-b border-foreground min-h-[30px] inline-block w-48 ml-2 align-bottom"></span>
              </div>
              <div>
                <span className="text-sm">Name:</span>
                <span className="border-b border-foreground min-h-[25px] inline-block w-48 ml-2 align-bottom"></span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                (Shop Support Depositor <span className="underline">Signature</span>)
              </div>
            </div>
            <div>
              <div className="mb-4">
                <span className="text-sm">Sign</span>
                <span className="border-b border-foreground min-h-[30px] inline-block w-48 ml-2 align-bottom"></span>
              </div>
              <div>
                <span className="text-sm">Name</span>
                <span className="border-b border-foreground min-h-[25px] inline-block w-48 ml-2 align-bottom"></span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">(IT Store Receiver)</div>
            </div>
          </div>

          <div className="mt-12 pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground mb-1">
              Copyright &copy; {new Date().getFullYear()} Shop Return Management System. All Rights Reserved.
            </p>
            <p className="text-sm font-semibold">Powered by Hammad Jahangir</p>
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