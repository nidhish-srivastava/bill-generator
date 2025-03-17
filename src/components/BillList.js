"use client"
import { useState } from 'react';

export default function BillList({ bills, onExportExcel, onNewBill }) {
  const [selectedBill, setSelectedBill] = useState(null);
  
  const handlePrintBill = (bill) => {
    // Create a temporary iframe to print the bill
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const subtotal = bill.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxAmount = subtotal * (bill.taxRate / 100);
    const total = subtotal + taxAmount;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${bill.bill.number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .page { page-break-after: always; padding-bottom: 50px; }
          .header { text-align: center; margin-bottom: 20px; }
          .flex { display: flex; justify-content: space-between; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: #f2f2f2; }
          .total { width: 250px; margin-left: auto; }
          .total div { display: flex; justify-content: space-between; padding: 5px 0; }
          .total .border-bottom { border-bottom: 1px solid #ddd; }
          .total .bold { font-weight: bold; }
          .notes { margin-top: 20px; }
          .footer { margin-top: 30px; text-align: center; color: #666; }
          .copy-label { font-weight: bold; text-align: center; margin-top: 20px; }
        </style>
      </head>
      <body>
        <!-- First Copy -->
        <div class="page">
          <div class="header">
            <h1>${bill.company.name}</h1>
            <p>${bill.company.address}</p>
            <p>Phone: ${bill.company.phone} | Email: ${bill.company.email}</p>
          </div>
          
          <div class="flex">
            <div>
              <h2>Bill To:</h2>
              <p><strong>${bill.customer.name}</strong></p>
              <p>${bill.customer.address}</p>
              ${bill.customer.phone ? `<p>Phone: ${bill.customer.phone}</p>` : ''}
              ${bill.customer.email ? `<p>Email: ${bill.customer.email}</p>` : ''}
            </div>
            <div style="text-align: right;">
              <h2>INVOICE</h2>
              <p>Invoice Number: <strong>${bill.bill.number}</strong></p>
              <p>Date: <strong>${bill.bill.date}</strong></p>
            </div>
          </div>
          
          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${bill.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price.toFixed(2)}</td>
                  <td>₹${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total">
            <div>
              <span>Subtotal:</span>
              <span>₹${subtotal.toFixed(2)}</span>
            </div>
            <div class="border-bottom">
              <span>Tax (${bill.taxRate}%):</span>
              <span>₹${taxAmount.toFixed(2)}</span>
            </div>
            <div class="bold">
              <span>Total:</span>
              <span>₹${total.toFixed(2)}</span>
            </div>
          </div>
          
          ${bill.notes ? `
            <div class="notes">
              <h3>Notes:</h3>
              <p>${bill.notes}</p>
            </div>
          ` : ''}
          
          <div class="footer">
            <p>Payment Mode: ${bill.paymentMode}</p>
            <p>Thank you for your business!</p>
            <p class="copy-label">Customer Copy</p>
          </div>
        </div>
        
        <!-- Second Copy -->
        <div class="page">
          <div class="header">
            <h1>${bill.company.name}</h1>
            <p>${bill.company.address}</p>
            <p>Phone: ${bill.company.phone} | Email: ${bill.company.email}</p>
          </div>
          
          <div class="flex">
            <div>
              <h2>Bill To:</h2>
              <p><strong>${bill.customer.name}</strong></p>
              <p>${bill.customer.address}</p>
              ${bill.customer.phone ? `<p>Phone: ${bill.customer.phone}</p>` : ''}
              ${bill.customer.email ? `<p>Email: ${bill.customer.email}</p>` : ''}
            </div>
            <div style="text-align: right;">
              <h2>INVOICE</h2>
              <p>Invoice Number: <strong>${bill.bill.number}</strong></p>
              <p>Date: <strong>${bill.bill.date}</strong></p>
            </div>
          </div>
          
          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${bill.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price.toFixed(2)}</td>
                  <td>₹${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total">
            <div>
              <span>Subtotal:</span>
              <span>₹${subtotal.toFixed(2)}</span>
            </div>
            <div class="border-bottom">
              <span>Tax (${bill.taxRate}%):</span>
              <span>₹${taxAmount.toFixed(2)}</span>
            </div>
            <div class="bold">
              <span>Total:</span>
              <span>₹${total.toFixed(2)}</span>
            </div>
          </div>
          
          ${bill.notes ? `
            <div class="notes">
              <h3>Notes:</h3>
              <p>${bill.notes}</p>
            </div>
          ` : ''}
          
          <div class="footer">
            <p>Payment Mode: ${bill.paymentMode}</p>
            <p>Thank you for your business!</p>
            <p class="copy-label">Merchant Copy</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(html);
    iframe.contentWindow.document.close();
    
    setTimeout(() => {
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    }, 500);
  };

  const handleShareBill = (bill) => {
    if (!navigator.share) {
      alert("Web Share API is not supported in your browser");
      return;
    }
    
    const subtotal = bill.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxAmount = subtotal * (bill.taxRate / 100);
    const total = subtotal + taxAmount;
    
    // Generate bill data in a format suitable for sharing
    const billText = `
      Invoice: ${bill.bill.number}
      Date: ${bill.bill.date}
      
      From: ${bill.company.name}
      ${bill.company.address}
      
      To: ${bill.customer.name}
      ${bill.customer.address}
      
      Items:
      ${bill.items.map(item => `${item.description}: ${item.quantity} x ₹${item.price} = ₹${(item.quantity * item.price).toFixed(2)}`).join('\n')}
      
      Subtotal: ₹${subtotal.toFixed(2)}
      Tax (${bill.taxRate}%): ₹${taxAmount.toFixed(2)}
      Total: ₹${total.toFixed(2)}
    `;
    
    navigator.share({
      title: `Invoice ${bill.bill.number}`,
      text: billText,
    });
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">All Bills ({bills.length})</h2>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onNewBill}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            New Bill
          </button>
          <button
            type="button"
            onClick={onExportExcel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Export to Excel
          </button>
        </div>
      </div>
      
      {bills.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No bills saved yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Number</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bills.map((bill) => {
                const subtotal = bill.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                const taxAmount = subtotal * (bill.taxRate / 100);
                const total = subtotal + taxAmount;
                
                return (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <button
                        type="button"
                        onClick={() => setSelectedBill(selectedBill === bill.id ? null : bill.id)}
                        className="hover:underline focus:outline-none"
                      >
                        {bill.bill.number}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.bill.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.customer.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => handlePrintBill(bill)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShareBill(bill)}
                          className="text-green-600 hover:text-green-900"
                        >
                          WhatsApp
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Bill Details Panel */}
      {selectedBill && (
        <div className="mt-6 bg-gray-50 p-4 rounded-md">
          {bills.filter(bill => bill.id === selectedBill).map((bill) => {
            const subtotal = bill.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
            const taxAmount = subtotal * (bill.taxRate / 100);
            const total = subtotal + taxAmount;
            
            return (
              <div key={bill.id}>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Bill Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Bill Information</h4>
                    <p className="mt-1">Invoice Number: <span className="font-medium">{bill.bill.number}</span></p>
                    <p>Date: <span className="font-medium">{bill.bill.date}</span></p>
                    <p>Payment Mode: <span className="font-medium">{bill.paymentMode}</span></p>
                    <p>Tax Rate: <span className="font-medium">{bill.taxRate}%</span></p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Customer Information</h4>
                    <p className="mt-1">Name: <span className="font-medium">{bill.customer.name || 'N/A'}</span></p>
                    <p>Address: <span className="font-medium">{bill.customer.address || 'N/A'}</span></p>
                    <p>Phone: <span className="font-medium">{bill.customer.phone || 'N/A'}</span></p>
                    <p>Email: <span className="font-medium">{bill.customer.email || 'N/A'}</span></p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Items</h4>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bill.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-2 whitespace-nowrap text-sm">{item.description}</td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm">{item.quantity}</td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm">₹{item.price.toFixed(2)}</td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm">₹{(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-white">
                      <tr>
                        <td colSpan="3" className="px-6 py-2 text-right text-sm font-medium">Subtotal:</td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm">₹{subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="px-6 py-2 text-right text-sm font-medium">Tax ({bill.taxRate}%):</td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm">₹{taxAmount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="px-6 py-2 text-right text-sm font-bold">Total:</td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm font-bold">₹{total.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                {bill.notes && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600">{bill.notes}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
