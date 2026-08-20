import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import confetti from 'canvas-confetti';

export const AiInvoiceScanner: React.FC = () => {
  const {
    products,
    extractedInvoice,
    updateExtractedItem,
    resolveUncertainItemMatch,
    removeExtractedItem,
    addExtractedItem,
    confirmExtractedInvoice,
    resetExtractedInvoice,
    setActiveTab,
    addToast
  } = useApp();

  const [selectedUncertainId, setSelectedUncertainId] = useState<string>('ext-2');
  const [masterSearchQuery, setMasterSearchQuery] = useState('');
  const [isScanningSimulated, setIsScanningSimulated] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showAddManualModal, setShowAddManualModal] = useState(false);
  const [manualItemForm, setManualItemForm] = useState({
    name: '',
    productId: '',
    qty: 10,
    rate: 2.50,
    batch: 'NEW-001',
    expiry: '12/2027'
  });

  const uncertainCount = extractedInvoice.items.filter(i => i.matchStatus === 'Uncertain').length;
  const isInvoiceReady = extractedInvoice.status !== 'confirmed';

  const handleSelectMasterMatch = (product: Product, confidence: number) => {
    if (!selectedUncertainId) return;
    resolveUncertainItemMatch(selectedUncertainId, product, confidence);
  };

  const handleTriggerConfirm = () => {
    if (uncertainCount > 0) {
      const proceed = confirm(`You have ${uncertainCount} unverified item(s). Are you sure you want to commit to inventory?`);
      if (!proceed) return;
    }
    confirmExtractedInvoice();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handleSimulateNewScan = (supplier: string, invNum: string) => {
    setIsScanningSimulated(true);
    addToast('info', 'AI OCR Processing', 'Analyzing scanned document layout and item rows...');
    setTimeout(() => {
      resetExtractedInvoice();
      setIsScanningSimulated(false);
      addToast('success', 'Extraction Complete', `Extracted 3 line items from ${supplier} (${invNum})`);
    }, 1200);
  };

  const handleAddManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedProd = products.find(p => p.id === manualItemForm.productId) || products[0];
    addExtractedItem({
      extractedName: manualItemForm.name || matchedProd.name,
      matchedProductId: matchedProd.id,
      matchedProductName: matchedProd.name,
      matchedSku: matchedProd.sku,
      matchConfidence: 100,
      matchStatus: 'Matched',
      quantity: Number(manualItemForm.qty),
      rate: Number(manualItemForm.rate),
      batchNumber: manualItemForm.batch,
      expiryDate: manualItemForm.expiry,
      isExpiryMissing: false
    });
    setShowAddManualModal(false);
    addToast('success', 'Item Added', `Added ${manualItemForm.name || matchedProd.name} to invoice`);
  };

  const filteredMasterProducts = masterSearchQuery.trim() === ''
    ? products.slice(0, 4)
    : products.filter(p => p.name.toLowerCase().includes(masterSearchQuery.toLowerCase()) || p.sku.toLowerCase().includes(masterSearchQuery.toLowerCase()));

  return (
    <div className="p-6 max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-6">
      {/* Left Column: Upload & Processing Mockup (1/3) */}
      <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-5">
        {/* Upload Zone */}
        <div
          onClick={() => handleSimulateNewScan('Unilever Distro Hub', 'INV-2023-884')}
          className="bg-[#FFFFFF] rounded border-2 border-dashed border-[#1A1A1A]/20 p-6 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-[#F4F1EA] hover:border-[#1A1A1A] transition-all shadow-2xs group"
        >
          <div className="w-14 h-14 bg-[#EEEBE3] rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[#1A1A1A] text-3xl">document_scanner</span>
          </div>
          <h3 className="text-[16px] font-serif font-bold text-[#1A1A1A] mb-1">Optical Scan Ingestion</h3>
          <p className="text-[12px] text-[#5C5850] mb-4 max-w-xs font-sans">
            Drop supplier physical invoices, PDF bills, or activate high-res camera.
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCameraActive(!isCameraActive);
            }}
            className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 text-[11.5px] font-medium py-2 px-4 rounded flex items-center gap-2 hover:bg-[#2A2A2A] transition-all cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px] text-[#D4AF37]">photo_camera</span>
            {isCameraActive ? 'Dismiss Camera' : 'Capture Camera Feed'}
          </button>
        </div>

        {/* Camera Simulation View */}
        {isCameraActive && (
          <div className="bg-[#1A1A1A] text-white p-4 rounded flex flex-col items-center relative overflow-hidden shadow-xl border border-[#D4AF37]/30 animate-in fade-in">
            <div className="w-full h-40 bg-[#252525] rounded flex flex-col items-center justify-center border border-dashed border-[#D4AF37]/60 relative">
              <span className="material-symbols-outlined text-4xl text-[#D4AF37] animate-pulse">center_focus_strong</span>
              <span className="text-[11px] text-[#E5D7B7] mt-2 font-mono-data">Align Invoice Lines Inside Frame</span>
              <div className="absolute top-2 left-2 text-[9px] bg-[#8B2626] text-[#F9F7F2] px-1.5 py-0.5 rounded font-mono-data font-bold">LIVE OCR</div>
            </div>
            <button
              onClick={() => {
                setIsCameraActive(false);
                handleSimulateNewScan('Unilever Distro Hub', 'INV-2023-884');
              }}
              className="mt-3 bg-[#D4AF37] hover:bg-[#C29D29] text-[#1A1A1A] text-[11.5px] font-bold px-4 py-1.5 rounded flex items-center gap-1.5 cursor-pointer font-mono-data"
            >
              <span className="material-symbols-outlined text-[15px]">camera</span> Ingest & Extract
            </button>
          </div>
        )}

        {/* Processing Mockup with Bounding Boxes */}
        <div className="bg-[#FFFFFF] rounded border border-[#1A1A1A]/12 p-4 flex-1 flex flex-col relative overflow-hidden shadow-2xs">
          <div className="h-1 w-full absolute top-0 left-0 bg-[#D4AF37]"></div>
          
          <div className="flex items-center justify-between mb-3 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#8C733E] text-[17px] fill-1">auto_awesome</span>
              <h3 className="text-[13px] font-serif font-bold text-[#1A1A1A]">
                OCR Parser Pipeline
              </h3>
            </div>
            <span className="font-mono-data text-[11px] text-[#1A1A1A] bg-[#EEEBE3] border border-[#1A1A1A]/10 px-2 py-0.5 rounded font-semibold">
              {extractedInvoice.invoiceNumber}
            </span>
          </div>

          {/* Scanned Image Preview with Dynamic Pulsating Extraction Boxes */}
          <div className="relative flex-1 min-h-[190px] bg-[#F4F1EA] rounded border border-[#1A1A1A]/10 overflow-hidden flex flex-col items-center justify-center group">
            {extractedInvoice.rawImageUrl ? (
              <img
                src={extractedInvoice.rawImageUrl}
                alt="Scanned Document"
                className={`w-full h-52 object-cover opacity-60 grayscale mix-blend-multiply ${
                  isScanningSimulated ? 'animate-pulse' : ''
                }`}
              />
            ) : (
              <div className="text-center p-4">
                <span className="material-symbols-outlined text-4xl text-[#78746D]">receipt</span>
                <p className="text-[11.5px] text-[#78746D] mt-1 font-mono-data">Invoice Document Loaded</p>
              </div>
            )}

            {/* Simulated extraction bounding boxes */}
            <div className="absolute inset-0 p-3 pointer-events-none">
              <div className="border border-[#1A1A1A] bg-[#1A1A1A]/10 rounded px-2 py-1 absolute top-3 left-3 w-40 h-6 animate-pulse-subtle flex items-center">
                <span className="text-[9px] font-mono-data font-bold text-[#1A1A1A] bg-white/90 px-1 rounded">Supplier: Unilever</span>
              </div>
              <div className="border border-[#1A1A1A] bg-[#1A1A1A]/10 rounded px-2 py-1 absolute top-11 left-3 w-28 h-5 animate-pulse-subtle flex items-center" style={{ animationDelay: '0.2s' }}>
                <span className="text-[9px] font-mono-data font-bold text-[#1A1A1A] bg-white/90 px-1 rounded">Date: Oct 24</span>
              </div>
              <div className="border border-[#234E3E] bg-[#234E3E]/10 rounded px-2 py-1 absolute top-20 left-3 right-3 h-8 animate-pulse-subtle flex items-center justify-between" style={{ animationDelay: '0.4s' }}>
                <span className="text-[9px] font-mono-data font-bold text-[#234E3E] bg-white/90 px-1 rounded">Item 1: Dove Soap (144)</span>
                <span className="text-[9px] font-mono-data font-bold text-[#234E3E] bg-[#E8F0EB] px-1 rounded">98% Confidence</span>
              </div>
              <div className="border border-[#9C5B23] bg-[#9C5B23]/10 rounded px-2 py-1 absolute top-31 left-3 right-3 h-8 animate-pulse-subtle flex items-center justify-between" style={{ animationDelay: '0.6s' }}>
                <span className="text-[9px] font-mono-data font-bold text-[#9C5B23] bg-white/90 px-1 rounded">Item 2: Lipton Ylw (50)</span>
                <span className="text-[9px] font-mono-data font-bold text-[#9C5B23] bg-[#FBF4E8] px-1 rounded">68% Uncertain</span>
              </div>
            </div>
          </div>

          {/* Extracted Header Meta */}
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between items-center bg-[#F4F1EA] p-2 rounded text-[12px] border border-[#1A1A1A]/8">
              <span className="text-[#78746D]">Supplier Entity:</span>
              <span className="font-mono-data text-[#1A1A1A] font-semibold">{extractedInvoice.supplierName}</span>
            </div>
            <div className="flex justify-between items-center bg-[#F4F1EA] p-2 rounded text-[12px] border border-[#1A1A1A]/8">
              <span className="text-[#78746D]">Posting Date:</span>
              <span className="font-mono-data text-[#1A1A1A] font-semibold">{extractedInvoice.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Verification & Matching (Flex-1) */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-2 border-b border-[#1A1A1A]/10">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-editorial text-[#8C733E]">Audit Verification</span>
            <h2 className="text-[26px] font-serif font-bold text-[#1A1A1A] tracking-tight leading-tight">
              Review Extracted Items
            </h2>
            <p className="text-[13px] text-[#5C5850] mt-0.5 font-sans">
              {uncertainCount > 0
                ? `Human-in-the-loop verification required for ${uncertainCount} item${uncertainCount > 1 ? 's' : ''}.`
                : 'All items matched successfully. Ready to commit to inventory.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={resetExtractedInvoice}
              className="bg-[#FFFFFF] border border-[#1A1A1A]/20 text-[#1A1A1A] text-[11.5px] font-medium py-2 px-3.5 rounded hover:bg-[#F4F1EA] transition-colors cursor-pointer"
            >
              Reset Buffer
            </button>
            <button
              onClick={() => setShowAddManualModal(true)}
              className="bg-[#FFFFFF] border border-[#1A1A1A]/20 text-[#1A1A1A] text-[11.5px] font-medium py-2 px-3.5 rounded flex items-center gap-1.5 hover:bg-[#F4F1EA] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px] text-[#78746D]">add</span>
              Add Manual Line
            </button>
            <button
              onClick={handleTriggerConfirm}
              className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 text-[11.5px] font-medium py-2 px-4 rounded flex items-center gap-1.5 hover:bg-[#2A2A2A] transition-all cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px] text-[#D4AF37]">check_circle</span>
              Post to Inventory
            </button>
          </div>
        </div>

        {/* Review Table */}
        <div className="bg-[#FFFFFF] rounded border border-[#1A1A1A]/12 overflow-hidden shadow-2xs flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F4F1EA] border-b border-[#1A1A1A]/10 text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">
                <tr>
                  <th className="p-3 w-1/3">Extracted Product Name</th>
                  <th className="p-3">Match Status</th>
                  <th className="p-3 text-right">Qty</th>
                  <th className="p-3 text-right">Rate</th>
                  <th className="p-3">Lot / Expiry</th>
                  <th className="p-3 text-center w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/8 text-[12.5px] font-mono-data bg-[#FFFFFF]">
                {extractedInvoice.items.map((item) => {
                  const isUncertain = item.matchStatus === 'Uncertain';
                  const isSelected = selectedUncertainId === item.id;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => isUncertain && setSelectedUncertainId(item.id)}
                      className={`transition-colors cursor-pointer ${
                        isUncertain
                          ? 'bg-[#FDFBF7] relative'
                          : 'hover:bg-[#F4F1EA]'
                      } ${isSelected ? 'border-l-4 border-l-[#8C733E]' : ''}`}
                    >
                      {/* Product Name */}
                      <td className="p-3 text-[#1A1A1A] font-semibold">
                        <div className="flex items-center gap-1">
                          <span className="font-sans font-medium text-[13px]">{item.extractedName}</span>
                          {isUncertain && (
                            <span
                              className="material-symbols-outlined text-[14px] text-[#9C5B23]"
                              title="AI Confidence: 68%"
                            >
                              warning
                            </span>
                          )}
                        </div>
                        {item.matchedSku && (
                          <div className="text-[11px] text-[#78746D] font-mono-data">
                            SKU: {item.matchedSku}
                          </div>
                        )}
                      </td>

                      {/* Match Status Badge */}
                      <td className="p-3 font-sans">
                        {item.matchStatus === 'Matched' && (
                          <span className="inline-flex items-center gap-1 bg-[#E8F0EB] text-[#234E3E] border border-[#234E3E]/20 px-2 py-0.5 rounded text-[10px] font-bold">
                            <span className="material-symbols-outlined text-[12px]">check_circle</span>
                            Matched
                          </span>
                        )}
                        {item.matchStatus === 'Uncertain' && (
                          <span className="inline-flex items-center gap-1 bg-[#FBF4E8] text-[#9C5B23] border border-[#9C5B23]/25 px-2 py-0.5 rounded text-[10px] font-bold">
                            <span className="material-symbols-outlined text-[12px]">help</span>
                            Review Needed
                          </span>
                        )}
                      </td>

                      {/* Qty */}
                      <td className="p-3 text-right font-bold text-[#1A1A1A]">
                        {item.quantity}
                      </td>

                      {/* Rate */}
                      <td className="p-3 text-right text-[#1A1A1A]">
                        ${item.rate.toFixed(2)}
                      </td>

                      {/* Batch & Expiry */}
                      <td className="p-3 text-[11.5px]">
                        <div>Lot: {item.batchNumber}</div>
                        <div className={item.isExpiryMissing ? 'text-[#8B2626] font-bold' : 'text-[#78746D]'}>
                          Exp: {item.expiryDate}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUncertainId(item.id);
                            }}
                            className="text-[#1A1A1A] hover:text-[#8C733E] p-1"
                            title="Resolve Match"
                          >
                            <span className="material-symbols-outlined text-[17px]">edit</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeExtractedItem(item.id);
                            }}
                            className="text-[#78746D] hover:text-[#8B2626] p-1"
                            title="Delete Line"
                          >
                            <span className="material-symbols-outlined text-[17px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Matching Resolution Panel (Attached to Uncertain Item) */}
        {uncertainCount > 0 && (
          <div className="bg-[#FFFFFF] rounded border border-[#1A1A1A]/20 p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[14.5px] font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
                Resolve Line Match: "Lipton Ylw Lbl 250g"
              </h4>
              <span className="text-[10px] text-[#8C733E] font-bold font-mono-data bg-[#EEEBE3] border border-[#1A1A1A]/10 px-2 py-0.5 rounded">
                AI Suggested Mapping
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {/* Suggestion 1: 92% Match (Box) */}
              <div
                onClick={() => {
                  const targetProd = products.find(p => p.sku === 'LIP-YL-250-B') || products[0];
                  handleSelectMasterMatch(targetProd, 92);
                }}
                className="border border-[#1A1A1A]/20 rounded p-3 cursor-pointer hover:border-[#1A1A1A] hover:bg-[#F4F1EA] transition-all relative group shadow-2xs bg-[#FDFBF7]"
              >
                <div className="absolute top-2 right-2 flex items-center gap-1 text-[#234E3E] text-[10px] font-mono-data font-bold bg-[#E8F0EB] px-1.5 py-0.2 rounded border border-[#234E3E]/20">
                  <span className="material-symbols-outlined text-[12px]">done</span>
                  92% Match
                </div>
                <div className="font-sans text-[12.5px] text-[#1A1A1A] font-bold mb-1">
                  Lipton Yellow Label Tea 250g Box
                </div>
                <div className="text-[11px] text-[#78746D] font-mono-data">
                  SKU: LIP-YL-250-B | Master Catalog
                </div>
              </div>

              {/* Suggestion 2: 45% Match (Jar) */}
              <div
                onClick={() => {
                  const targetProd = products.find(p => p.sku === 'LIP-YL-500-J') || products[0];
                  handleSelectMasterMatch(targetProd, 45);
                }}
                className="border border-[#1A1A1A]/15 rounded p-3 cursor-pointer hover:border-[#1A1A1A] hover:bg-[#F4F1EA] transition-all relative shadow-2xs bg-[#FFFFFF]"
              >
                <div className="flex justify-end mb-1">
                  <span className="text-[#78746D] text-[10px] font-mono-data font-bold bg-[#EEEBE3] px-1.5 py-0.2 rounded">
                    45% Match
                  </span>
                </div>
                <div className="font-sans text-[12.5px] text-[#1A1A1A] font-bold mb-1">
                  Lipton Yellow Label Tea 500g Jar
                </div>
                <div className="text-[11px] text-[#78746D] font-mono-data">
                  SKU: LIP-YL-500-J | Master Catalog
                </div>
              </div>
            </div>

            {/* Or Search Product Master Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#78746D] text-[17px]">
                search
              </span>
              <input
                type="text"
                value={masterSearchQuery}
                onChange={(e) => setMasterSearchQuery(e.target.value)}
                placeholder="Or search master catalog SKU..."
                className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/20 rounded pl-8 pr-3 py-1.5 text-[12px] text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] focus:bg-white"
              />
            </div>

            {masterSearchQuery.trim() !== '' && (
              <div className="mt-2 space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                {filteredMasterProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectMasterMatch(p, 95)}
                    className="w-full text-left p-2 rounded hover:bg-[#F4F1EA] flex justify-between items-center text-[11.5px] font-mono-data border-b border-[#1A1A1A]/8"
                  >
                    <span className="font-bold text-[#1A1A1A]">{p.sku} - {p.name}</span>
                    <span className="text-[#234E3E] font-bold">Assign</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Manual Item Modal */}
      {showAddManualModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded max-w-md w-full p-5 shadow-2xl animate-in zoom-in-95 border border-[#1A1A1A]/20">
            <h3 className="text-[16px] font-serif font-bold text-[#1A1A1A] mb-3">Add Manual Inbound Line</h3>
            <form onSubmit={handleAddManualSubmit} className="space-y-3 text-[12.5px]">
              <div>
                <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Select Catalog SKU</label>
                <select
                  value={manualItemForm.productId}
                  onChange={(e) => {
                    const prod = products.find(p => p.id === e.target.value);
                    setManualItemForm({
                      ...manualItemForm,
                      productId: e.target.value,
                      name: prod ? prod.name : '',
                      rate: prod ? prod.purchasePrice : 2.50
                    });
                  }}
                  className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A] bg-[#FFFFFF]"
                  required
                >
                  <option value="">Select SKU...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={manualItemForm.qty}
                    onChange={(e) => setManualItemForm({ ...manualItemForm, qty: Number(e.target.value) })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A] font-mono-data"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Unit Rate ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={manualItemForm.rate}
                    onChange={(e) => setManualItemForm({ ...manualItemForm, rate: Number(e.target.value) })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A] font-mono-data"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Lot / Batch ID</label>
                  <input
                    type="text"
                    value={manualItemForm.batch}
                    onChange={(e) => setManualItemForm({ ...manualItemForm, batch: e.target.value })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A] font-mono-data"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Expiry (MM/YYYY)</label>
                  <input
                    type="text"
                    value={manualItemForm.expiry}
                    onChange={(e) => setManualItemForm({ ...manualItemForm, expiry: e.target.value })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A] font-mono-data"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#1A1A1A]/10">
                <button
                  type="button"
                  onClick={() => setShowAddManualModal(false)}
                  className="px-3 py-1.5 text-[#5C5850] hover:bg-[#F4F1EA] rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1A1A1A] text-[#F9F7F2] font-medium rounded hover:bg-[#2A2A2A]"
                >
                  Append Line Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
