
export default function BillForm({ bill, setBill, onSave, onPreview }) {
  const addItem = () => {
    setBill({
      ...bill,
      items: [...bill.items, { description: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index) => {
    const items = [...bill.items];
    items.splice(index, 1);
    setBill({ ...bill, items });
  };

  const updateItem = (index, field, value) => {
    const items = [...bill.items];
    items[index][field] = field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value;
    setBill({ ...bill, items });
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Information */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Company Information</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={bill.company.name}
              onChange={(e) => setBill({ ...bill, company: { ...bill.company, name: e.target.value } })}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Company Address</label>
            <textarea
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows="3"
              value={bill.company.address}
              onChange={(e) => setBill({ ...bill, company: { ...bill.company, address: e.target.value } })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={bill.company.phone}
                onChange={(e) => setBill({ ...bill, company: { ...bill.company, phone: e.target.value } })}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={bill.company.email}
                onChange={(e) => setBill({ ...bill, company: { ...bill.company, email: e.target.value } })}
              />
            </div>
          </div>
        </div>

        {/* Bill Information */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Bill Information</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Bill Number</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={bill.bill.number}
                onChange={(e) => setBill({ ...bill, bill: { ...bill.bill, number: e.target.value } })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={bill.bill.date}
                onChange={(e) => setBill({ ...bill, bill: { ...bill.bill, date: e.target.value } })}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={bill.customer.name}
              onChange={(e) => setBill({ ...bill, customer: { ...bill.customer, name: e.target.value } })}
              placeholder="Customer Name"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Customer Address</label>
            <textarea
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows="3"
              value={bill.customer.address}
              onChange={(e) => setBill({ ...bill, customer: { ...bill.customer, address: e.target.value } })}
              placeholder="Customer Address"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={bill.customer.phone}
                onChange={(e) => setBill({ ...bill, customer: { ...bill.customer, phone: e.target.value } })}
                placeholder="Phone Number"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={bill.customer.email}
                onChange={(e) => setBill({ ...bill, customer: { ...bill.customer, email: e.target.value } })}
                placeholder="Email Address"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Items</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bill.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      className="block w-full border-0 focus:ring-0 sm:text-sm"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Item description"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      className="block w-full border-0 focus:ring-0 sm:text-sm"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      min="1"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      className="block w-full border-0 focus:ring-0 sm:text-sm"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-now">
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {bill.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4">
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            + Add Item
          </button>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
          <textarea
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            rows="4"
            value={bill.notes}
            onChange={(e) => setBill({ ...bill, notes: e.target.value })}
            placeholder="Additional notes or payment instructions"
          />
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tax Rate</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={bill.taxRate}
              onChange={(e) => setBill({ ...bill, taxRate: parseInt(e.target.value) })}
            >
              <option value="0">0% GST</option>
              <option value="5">5% GST</option>
              <option value="12">12% GST</option>
              <option value="18">18% GST</option>
              <option value="28">28% GST</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={bill.paymentMode}
              onChange={(e) => setBill({ ...bill, paymentMode: e.target.value })}
            >
              <option value="Cash Payment">Cash Payment</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          onClick={onPreview}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Preview
        </button>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Bill
        </button>
      </div>
    </div>
  );
}