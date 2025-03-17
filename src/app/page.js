"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import BillForm from '../components/BillForm';
import BillPreview from '../components/BillPreview';
import BillList from '../components/BillList';

export default function Home() {
  const [view, setView] = useState('form'); // 'form', 'preview', 'list'
  const [currentBill, setCurrentBill] = useState({
    company: {
      name: 'Your Business Name',
      address: 'Your business Address',
      phone: 'Your Phone Number',
      email: 'Your Email'
    },
    bill: {
      number: 'INV-001',
      date: new Date().toISOString().split('T')[0]
    },
    customer: {
      name: '',
      address: '',
      phone: '',
      email: ''
    },
    items: [{ description: '', quantity: 1, price: 0 }],
    notes: '',
    taxRate: 0,
    paymentMode: 'Cash Payment'
  });
  const [savedBills, setSavedBills] = useState([]);

  // Load saved bills from localStorage on component mount
  useEffect(() => {
    const storedBills = localStorage.getItem('bills');
    if (storedBills) {
      setSavedBills(JSON.parse(storedBills));
    }
  }, []);

  const saveBill = () => {
    const updatedBills = [...savedBills, { ...currentBill, id: Date.now() }];
    setSavedBills(updatedBills);
    localStorage.setItem('bills', JSON.stringify(updatedBills));
    
    // Generate new bill number for next bill
    const billNumber = `INV-${String(updatedBills.length + 1).padStart(3, '0')}`;
    setCurrentBill({
      ...currentBill,
      bill: {
        ...currentBill.bill,
        number: billNumber,
        date: new Date().toISOString().split('T')[0]
      },
      customer: {
        name: '',
        address: '',
        phone: '',
        email: ''
      },
      items: [{ description: '', quantity: 1, price: 0 }],
      notes: ''
    });
    
    alert('Bill saved successfully!');
  };

  const exportToExcel = () => {
    import('xlsx').then(XLSX => {
      const worksheet = XLSX.utils.json_to_sheet(
        savedBills.map(bill => ({
          'Bill Number': bill.bill.number,
          'Date': bill.bill.date,
          'Customer': bill.customer.name,
          'Items': bill.items.map(item => `${item.description} (${item.quantity} x ₹${item.price})`).join(', '),
          'Total': bill.items.reduce((sum, item) => sum + (item.quantity * item.price), 0),
          'Tax': bill.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) * (bill.taxRate / 100),
          'Grand Total': bill.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) * (1 + bill.taxRate / 100)
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Bills');
      XLSX.writeFile(workbook, 'Anand_Communication_Bills.xlsx');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Anand Communication - Bill Generator</title>
        <meta name="description" content="Bill generator for Anand Communication" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center text-gray-900">Anand Communication</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setView('form')}
              className={`px-4 py-2 rounded-md ${view === 'form' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Edit Bill
            </button>
            <button
              onClick={() => setView('preview')}
              className={`px-4 py-2 rounded-md ${view === 'preview' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Preview
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Saved Bills ({savedBills.length})
            </button>
          </div>

          {view === 'form' && (
            <BillForm 
              bill={currentBill} 
              setBill={setCurrentBill} 
              onSave={saveBill} 
              onPreview={() => setView('preview')} 
            />
          )}

          {view === 'preview' && (
            <BillPreview 
              bill={currentBill} 
              onBack={() => setView('form')} 
              onSave={saveBill} 
            />
          )}

          {view === 'list' && (
            <BillList 
              bills={savedBills} 
              onExportExcel={exportToExcel} 
              onNewBill={() => setView('form')} 
            />
          )}
        </div>
      </main>
    </div>
  );
}
