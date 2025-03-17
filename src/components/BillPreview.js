"use client"

// components/BillPreview.js
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function BillPreview({ bill, onBack, onSave }) {
  const printRef = useRef();
  
  const subtotal = bill.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const taxAmount = subtotal * (bill.taxRate / 100);
  const total = subtotal + taxAmount;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Invoice_${bill.bill.number}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        html, body {
          height: 100%;
          margin: 0 !important;
          padding: 0 !important;
        }
        .print-container {
          page-break-after: always;
        }
      }
    `,
  });

  const handleShare = () => {
    if (!navigator.share) {
      alert("Web Share API is not supported in your browser");
      return;
    }
    
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
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="p-6">
        {/* Print Preview */}
        <div ref={printRef} className="mb-8">
          {/* First Copy */}
          <div className="print-container border-b border-dashed pb-8 mb-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">{bill.company.name}</h1>
              <p className="text-sm text-gray-600">{bill.company.address}</p>
              <p className="text-sm text-gray-600">Phone: {bill.company.phone} | Email: {bill.company.email}</p>
            </div>
            
            <div className="flex justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Bill To:</h2>
                <p className="font-medium">{bill.customer.name}</p>
                <p className="text-sm text-gray-600">{bill.customer.address}</p>
                {bill.customer.phone && <p className="text-sm text-gray-600">Phone: {bill.customer.phone}</p>}
                {bill.customer.email && <p className="text-sm text-gray-600">Email: {bill.customer.email}</p>}
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold mb-2">INVOICE</h2>
                <p className="text-sm">Invoice Number: <span className="font-medium">{bill.bill.number}</span></p>
                <p className="text-sm">Date: <span className="font-medium">{bill.bill.date}</span></p>
              </div>
            </div>
            
            <table className="min-w-full divide-y divide-gray-200 mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bill.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">₹{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">₹{(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span className="font-medium">Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Tax ({bill.taxRate}%):</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 font-bold">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {bill.notes && (
              <div className="mt-6">
                <h3 className="text-sm font-medium">Notes:</h3>
                <p className="text-sm text-gray-600">{bill.notes}</p>
              </div>
            )}
            
            <div className="mt-6 text-sm text-center text-gray-500">
              <p>Payment Mode: {bill.paymentMode}</p>
              <p className="mt-4">Thank you for your business!</p>
              <p className="font-semibold mt-1">Customer Copy</p>
            </div>
          </div>
          
          {/* Second Copy (Merchant Copy) */}
          <div className="print-container">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">{bill.company.name}</h1>
              <p className="text-sm text-gray-600">{bill.company.address}</p>
              <p className="text-sm text-gray-600">Phone: {bill.company.phone} | Email: {bill.company.email}</p>
            </div>
            
            <div className="flex justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Bill To:</h2>
                <p className="font-medium">{bill.customer.name}</p>
                <p className="text-sm text-gray-600">{bill.customer.address}</p>
                {bill.customer.phone && <p className="text-sm text-gray-600">Phone: {bill.customer.phone}</p>}
                {bill.customer.email && <p className="text-sm text-gray-600">Email: {bill.customer.email}</p>}
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold mb-2">INVOICE</h2>
                <p className="text-sm">Invoice Number: <span className="font-medium">{bill.bill.number}</span></p>
                <p className="text-sm">Date: <span className="font-medium">{bill.bill.date}</span></p>
              </div>
            </div>
            
            <table className="min-w-full divide-y divide-gray-200 mb-6">
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bill.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">₹{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">₹{(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span className="font-medium">Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Tax ({bill.taxRate}%):</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 font-bold">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {bill.notes && (
              <div className="mt-6">
                <h3 className="text-sm font-medium">Notes:</h3>
                <p className="text-sm text-gray-600">{bill.notes}</p>
              </div>
            )}
            
            <div className="mt-6 text-sm text-center text-gray-500">
              <p>Payment Mode: {bill.paymentMode}</p>
              <p className="mt-4">Thank you for your business!</p>
              <p className="font-semibold mt-1">Merchant Copy</p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Edit
          </button>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onSave}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Bill
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Download PDF
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Share to WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
