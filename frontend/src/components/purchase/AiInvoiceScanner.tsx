import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { api } from '../../services/api';
import { formatINR } from '../../utils/currency';
import confetti from 'canvas-confetti';

type ScanStatus = 'idle' | 'camera' | 'scanning' | 'review' | 'confirmed';

interface ExtractedItem {
  id: string;
  extractedName: string;
  matchedProductId: string;
  matchedProductName: string;
  matchedSku: string;
  matchConfidence: number;
  matchStatus: 'Matched' | 'Uncertain' | 'Unmatched';
  quantity: number;
  rate: number;
  batchNumber: string;
  expiryDate: string;
  isExpiryMissing: boolean;
}

export const AiInvoiceScanner: React.FC = () => {
  const {
    products,
    addToast,
    confirmExtractedInvoice,
    extractedInvoice,
    updateExtractedItem,
    resolveUncertainItemMatch,
    removeExtractedItem,
    addExtractedItem,
    resetExtractedInvoice,
    setActiveTab,
  } = useApp();

  // ── State ──────────────────────────────────────────────────────────────────
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [items, setItems] = useState<ExtractedItem[]>([]);
  const [scanError, setScanError] = useState<string | null>(null);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const [masterSearchQuery, setMasterSearchQuery] = useState('');
  const [selectedUncertainId, setSelectedUncertainId] = useState<string | null>(null);
  const [showAddManualModal, setShowAddManualModal] = useState(false);
  const [manualItemForm, setManualItemForm] = useState({
    name: '', productId: '', qty: 1, rate: 0, batch: '', expiry: '',
  });
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ── Cleanup camera on unmount ───────────────────────────────────────────────
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // ── Camera helpers ─────────────────────────────────────────────────────────
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    setScanError(null);
    setCameraPermissionDenied(false);

    if (!navigator.mediaDevices?.getUserMedia) {
      setScanError('Camera API not supported in this browser. Please upload an image file instead.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanStatus('camera');
    } catch (err: any) {
      stopCamera();
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraPermissionDenied(true);
        setScanError('Camera permission denied. Please allow camera access in your browser settings, or upload an image file.');
      } else if (err.name === 'NotFoundError') {
        setScanError('No camera found on this device. Please upload an image file instead.');
      } else {
        setScanError(`Camera error: ${err.message}. Please upload an image file instead.`);
      }
    }
  };

  const dismissCamera = () => {
    stopCamera();
    setScanStatus('idle');
    setScanError(null);
  };

  // ── Capture from video frame ───────────────────────────────────────────────
  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    stopCamera();
    setCapturedImageUrl(dataUrl);
    await processImage(dataUrl, 'image/jpeg');
  }, []);

  // ── Handle file upload ─────────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setScanError('Unsupported file type. Please upload a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setScanError('File too large (max 10 MB).');
      return;
    }

    setScanError(null);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      setCapturedImageUrl(dataUrl);
      await processImage(dataUrl, file.type);
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  // ── Core: send image to backend Gemini API ─────────────────────────────────
  const processImage = async (dataUrl: string, mimeType: string) => {
    setScanStatus('scanning');
    setScanError(null);
    addToast('info', 'AI OCR Processing', 'Sending image to Gemini for invoice extraction...');

    // Strip data URL prefix to get pure base64
    const base64 = dataUrl.split(',')[1];

    try {
      const res = await api.scanInvoice(base64, mimeType);
      const rawText: string = res.data?.extractedData ?? '';

      // Parse the JSON array Gemini returns
      const parsed = parseGeminiInvoiceResponse(rawText, products);
      if (parsed.length === 0) {
        setScanError('No line items could be extracted from this image. Please try a clearer photo or upload a different image.');
        setScanStatus('idle');
        addToast('warning', 'Extraction Empty', 'No items found. Try a clearer image.');
        return;
      }

      setItems(parsed);
      setScanStatus('review');
      addToast('success', 'Extraction Complete', `Extracted ${parsed.length} line item${parsed.length !== 1 ? 's' : ''} from invoice.`);
    } catch (err: any) {
      setScanStatus('idle');
      const msg = err?.message || 'Scan failed';
      if (msg.includes('AI_NOT_CONFIGURED') || msg.includes('GEMINI_API_KEY')) {
        setScanError('AI features require a GEMINI_API_KEY configured in the backend environment variables. Contact your administrator.');
      } else {
        setScanError(`Scan failed: ${msg}`);
      }
      addToast('error', 'Scan Failed', msg);
    }
  };

  // ── Parse Gemini text response into structured items ───────────────────────
  const parseGeminiInvoiceResponse = (text: string, productList: Product[]): ExtractedItem[] => {
    try {
      // Extract JSON array from the response text
      const match = text.match(/\[[\s\S]*\]/);
      if (!match) return [];
      const raw = JSON.parse(match[0]);
      if (!Array.isArray(raw)) return [];

      return raw.map((r: any, idx: number) => {
        const extractedName: string = r.productName || r.name || r.matchedProductName || `Item ${idx + 1}`;
        const qty = Number(r.quantity) || 1;
        const unitPrice = Number(r.unitPrice) || 0;
        const batchNumber = r.batchNumber || `BATCH-${Date.now()}-${idx}`;
        const expiryDate = r.expiryDate || '';
        const isExpiryMissing = !expiryDate;

        // Try to match to a product in catalog
        const matchedSku: string = r.matchedSku || '';
        let matchedProduct = productList.find(p =>
          (matchedSku && p.sku.toLowerCase() === matchedSku.toLowerCase()) ||
          p.name.toLowerCase().includes(extractedName.toLowerCase().substring(0, 6))
        );
        const confidence = r.confidence === 'high' ? 95 : r.confidence === 'medium' ? 70 : 45;
        const matchStatus: 'Matched' | 'Uncertain' | 'Unmatched' =
          matchedProduct && confidence >= 80 ? 'Matched'
          : matchedProduct ? 'Uncertain'
          : 'Unmatched';

        return {
          id: `ext-${Date.now()}-${idx}`,
          extractedName,
          matchedProductId: matchedProduct?.id || '',
          matchedProductName: matchedProduct?.name || extractedName,
          matchedSku: matchedProduct?.sku || matchedSku,
          matchConfidence: matchedProduct ? confidence : 0,
          matchStatus,
          quantity: qty,
          rate: unitPrice,
          batchNumber,
          expiryDate: expiryDate || 'MISSING',
          isExpiryMissing,
        };
      });
    } catch {
      return [];
    }
  };

  // ── Confirm & post to inventory ────────────────────────────────────────────
  const handleConfirm = () => {
    const uncertainCount = items.filter(i => i.matchStatus === 'Uncertain' || i.matchStatus === 'Unmatched').length;
    if (uncertainCount > 0) {
      const proceed = confirm(`${uncertainCount} item(s) are unverified. Proceed anyway?`);
      if (!proceed) return;
    }

    // Push items into extractedInvoice context so confirmExtractedInvoice() can work
    items.forEach(item => {
      addExtractedItem({
        extractedName: item.extractedName,
        matchedProductId: item.matchedProductId || 'prod-1',
        matchedProductName: item.matchedProductName,
        matchedSku: item.matchedSku,
        matchConfidence: item.matchConfidence,
        matchStatus: item.matchStatus === 'Unmatched' ? 'Uncertain' : item.matchStatus,
        quantity: item.quantity,
        rate: item.rate,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate,
        isExpiryMissing: item.isExpiryMissing,
      });
    });

    confirmExtractedInvoice();
    setScanStatus('confirmed');
    try { confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } }); } catch { /* ignore */ }
  };

  const handleReset = () => {
    setItems([]);
    setCapturedImageUrl(null);
    setScanStatus('idle');
    setScanError(null);
    setSelectedUncertainId(null);
    resetExtractedInvoice();
    addToast('info', 'Scanner Reset', 'Ready for a new invoice scan.');
  };

  // ── Manual item add ────────────────────────────────────────────────────────
  const handleAddManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === manualItemForm.productId) || products[0];
    const newItem: ExtractedItem = {
      id: `ext-manual-${Date.now()}`,
      extractedName: manualItemForm.name || prod.name,
      matchedProductId: prod.id,
      matchedProductName: prod.name,
      matchedSku: prod.sku,
      matchConfidence: 100,
      matchStatus: 'Matched',
      quantity: manualItemForm.qty,
      rate: manualItemForm.rate || prod.purchasePrice,
      batchNumber: manualItemForm.batch || `MANUAL-${Date.now()}`,
      expiryDate: manualItemForm.expiry || 'TBD',
      isExpiryMissing: !manualItemForm.expiry,
    };
    setItems(prev => [...prev, newItem]);
    setShowAddManualModal(false);
    setManualItemForm({ name: '', productId: '', qty: 1, rate: 0, batch: '', expiry: '' });
    addToast('success', 'Item Added', `Manually added ${newItem.extractedName}`);
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const resolveItem = (itemId: string, product: Product) => {
    setItems(prev => prev.map(i => i.id === itemId ? {
      ...i,
      matchedProductId: product.id,
      matchedProductName: product.name,
      matchedSku: product.sku,
      matchConfidence: 95,
      matchStatus: 'Matched',
    } : i));
    addToast('success', 'Match Resolved', `Mapped to SKU: ${product.sku}`);
    setSelectedUncertainId(null);
  };

  const filteredProducts = masterSearchQuery.trim() === ''
    ? products.slice(0, 6)
    : products.filter(p =>
        p.name.toLowerCase().includes(masterSearchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(masterSearchQuery.toLowerCase())
      );

  const uncertainCount = items.filter(i => i.matchStatus === 'Uncertain' || i.matchStatus === 'Unmatched').length;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-6">

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* ── Left Column ──────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-5">

        {/* Upload Zone */}
        {scanStatus === 'idle' && (
          <div className="bg-[#FFFFFF] rounded border-2 border-dashed border-[#1A1A1A]/20 p-6 text-center flex flex-col items-center justify-center shadow-2xs">
            <div className="w-14 h-14 bg-[#EEEBE3] rounded-full flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[#1A1A1A] text-3xl">document_scanner</span>
            </div>
            <h3 className="text-[16px] font-serif font-bold text-[#1A1A1A] mb-1">Optical Scan Ingestion</h3>
            <p className="text-[12px] text-[#5C5850] mb-4 font-sans">
              Capture with camera or upload a supplier invoice image (JPEG, PNG, WebP).
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={startCamera}
                className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 text-[11.5px] font-medium py-2 px-4 rounded flex items-center gap-2 hover:bg-[#2A2A2A] transition-all cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[15px] text-[#D4AF37]">photo_camera</span>
                Capture Camera Feed
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#FFFFFF] border border-[#1A1A1A]/20 text-[#1A1A1A] text-[11.5px] font-medium py-2 px-4 rounded flex items-center gap-2 hover:bg-[#F4F1EA] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">upload_file</span>
                Upload Invoice
              </button>
            </div>
            {scanError && (
              <div className="mt-3 bg-[#FBF0F0] border border-[#8B2626]/20 rounded p-3 text-[11.5px] text-[#8B2626] text-left w-full">
                <span className="material-symbols-outlined text-[14px] align-middle mr-1">error</span>
                {scanError}
              </div>
            )}
            {cameraPermissionDenied && (
              <p className="mt-2 text-[11px] text-[#78746D]">
                Tip: Click the camera icon in your browser address bar to grant permission.
              </p>
            )}
          </div>
        )}

        {/* Live Camera View */}
        {scanStatus === 'camera' && (
          <div className="bg-[#1A1A1A] text-white p-4 rounded flex flex-col items-center relative overflow-hidden shadow-xl border border-[#D4AF37]/30">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded border border-[#D4AF37]/40 max-h-56 object-cover"
            />
            <div className="absolute top-5 left-5 text-[9px] bg-[#8B2626] text-[#F9F7F2] px-1.5 py-0.5 rounded font-bold">LIVE</div>
            <p className="text-[11px] text-[#E5D7B7] mt-2 font-mono text-center">Align invoice within frame, then capture</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={captureFrame}
                className="bg-[#D4AF37] hover:bg-[#C29D29] text-[#1A1A1A] text-[11.5px] font-bold px-4 py-1.5 rounded flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">camera</span>
                Capture & Extract
              </button>
              <button
                onClick={dismissCamera}
                className="bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-white text-[11.5px] px-3 py-1.5 rounded cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Scanning / Processing state */}
        {scanStatus === 'scanning' && (
          <div className="bg-[#FFFFFF] rounded border border-[#1A1A1A]/12 p-6 flex flex-col items-center shadow-2xs">
            {capturedImageUrl && (
              <img src={capturedImageUrl} alt="Invoice" className="w-full max-h-40 object-cover rounded mb-3 opacity-70 grayscale" />
            )}
            <span className="material-symbols-outlined text-4xl text-[#8C733E] animate-spin">auto_awesome</span>
            <p className="text-[13px] font-serif font-bold text-[#1A1A1A] mt-2">AI OCR Processing...</p>
            <p className="text-[11.5px] text-[#78746D] mt-1 font-mono text-center">Sending to Gemini for invoice extraction</p>
          </div>
        )}

        {/* Image preview after scan */}
        {(scanStatus === 'review' || scanStatus === 'confirmed') && capturedImageUrl && (
          <div className="bg-[#FFFFFF] rounded border border-[#1A1A1A]/12 p-4 shadow-2xs">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-[#8C733E] text-[17px]">auto_awesome</span>
              <h3 className="text-[13px] font-serif font-bold text-[#1A1A1A]">OCR Parser Pipeline</h3>
              {scanStatus === 'confirmed' && (
                <span className="ml-auto bg-[#E8F0EB] text-[#234E3E] border border-[#234E3E]/20 text-[10px] font-bold px-2 py-0.5 rounded">CONFIRMED</span>
              )}
            </div>
            <img src={capturedImageUrl} alt="Scanned Invoice" className="w-full max-h-52 object-cover rounded opacity-70 grayscale" />
            <p className="text-[11px] text-[#78746D] mt-2 font-mono text-center">
              {items.length} line item{items.length !== 1 ? 's' : ''} extracted
            </p>
          </div>
        )}

        {/* Placeholder when no image yet but in review with no capture (edge case) */}
        {scanStatus === 'review' && !capturedImageUrl && (
          <div className="bg-[#FFFFFF] rounded border border-[#1A1A1A]/12 p-4 shadow-2xs flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl text-[#78746D]">receipt</span>
            <p className="text-[11.5px] text-[#78746D] mt-1 font-mono">Invoice processed</p>
          </div>
        )}
      </div>

      {/* ── Right Column: Review Table ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-2 border-b border-[#1A1A1A]/10">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-editorial text-[#8C733E]">Audit Verification</span>
            <h2 className="text-[26px] font-serif font-bold text-[#1A1A1A] tracking-tight leading-tight">
              {scanStatus === 'idle' ? 'Invoice Scanner' : scanStatus === 'scanning' ? 'Processing...' : 'Review Extracted Items'}
            </h2>
            <p className="text-[13px] text-[#5C5850] mt-0.5 font-sans">
              {scanStatus === 'idle'
                ? 'Capture or upload a supplier invoice to extract line items with AI.'
                : scanStatus === 'confirmed'
                ? 'Invoice confirmed and posted to inventory.'
                : uncertainCount > 0
                ? `Human-in-the-loop verification required for ${uncertainCount} item${uncertainCount !== 1 ? 's' : ''}.`
                : items.length > 0
                ? 'All items matched successfully. Ready to commit to inventory.'
                : 'Waiting for extraction...'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleReset}
              className="bg-[#FFFFFF] border border-[#1A1A1A]/20 text-[#1A1A1A] text-[11.5px] font-medium py-2 px-3.5 rounded hover:bg-[#F4F1EA] transition-colors cursor-pointer"
            >
              {scanStatus === 'confirmed' ? 'New Scan' : 'Reset'}
            </button>
            {scanStatus === 'review' && (
              <>
                <button
                  onClick={() => setShowAddManualModal(true)}
                  className="bg-[#FFFFFF] border border-[#1A1A1A]/20 text-[#1A1A1A] text-[11.5px] font-medium py-2 px-3.5 rounded flex items-center gap-1.5 hover:bg-[#F4F1EA] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#78746D]">add</span>
                  Add Manual Line
                </button>
                <button
                  onClick={handleConfirm}
                  className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 text-[11.5px] font-medium py-2 px-4 rounded flex items-center gap-1.5 hover:bg-[#2A2A2A] transition-all cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#D4AF37]">check_circle</span>
                  Post to Inventory
                </button>
              </>
            )}
          </div>
        </div>

        {/* Empty state */}
        {items.length === 0 && scanStatus !== 'scanning' && (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-center bg-[#FFFFFF] rounded border border-[#1A1A1A]/8 shadow-2xs">
            <span className="material-symbols-outlined text-5xl text-[#D2CFC6]">document_scanner</span>
            <p className="text-[14px] font-serif font-bold text-[#78746D] mt-3">No items extracted yet</p>
            <p className="text-[12px] text-[#A09C96] mt-1">
              {scanStatus === 'idle'
                ? 'Capture a camera image or upload an invoice file to begin.'
                : 'Scan failed or returned no items. Try again with a clearer image.'}
            </p>
          </div>
        )}

        {/* Review Table */}
        {items.length > 0 && (
          <div className="bg-[#FFFFFF] rounded border border-[#1A1A1A]/12 overflow-hidden shadow-2xs flex-1 flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F4F1EA] border-b border-[#1A1A1A]/10 text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">
                  <tr>
                    <th className="p-3 w-1/3">Extracted Product Name</th>
                    <th className="p-3">Match Status</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Rate (₹)</th>
                    <th className="p-3">Lot / Expiry</th>
                    <th className="p-3 text-center w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]/8 text-[12.5px] font-mono bg-[#FFFFFF]">
                  {items.map((item) => {
                    const isUncertain = item.matchStatus !== 'Matched';
                    const isSelected = selectedUncertainId === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => isUncertain && setSelectedUncertainId(item.id)}
                        className={`transition-colors ${isUncertain ? 'cursor-pointer bg-[#FDFBF7]' : 'hover:bg-[#F4F1EA]'} ${isSelected ? 'border-l-4 border-l-[#8C733E]' : ''}`}
                      >
                        <td className="p-3 text-[#1A1A1A] font-semibold">
                          <div className="flex items-center gap-1">
                            <span className="font-sans font-medium text-[13px]">{item.extractedName}</span>
                            {isUncertain && (
                              <span className="material-symbols-outlined text-[14px] text-[#9C5B23]" title="Needs review">warning</span>
                            )}
                          </div>
                          {item.matchedSku && (
                            <div className="text-[11px] text-[#78746D]">SKU: {item.matchedSku}</div>
                          )}
                        </td>
                        <td className="p-3 font-sans">
                          {item.matchStatus === 'Matched' ? (
                            <span className="inline-flex items-center gap-1 bg-[#E8F0EB] text-[#234E3E] border border-[#234E3E]/20 px-2 py-0.5 rounded text-[10px] font-bold">
                              <span className="material-symbols-outlined text-[12px]">check_circle</span>Matched
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-[#FBF4E8] text-[#9C5B23] border border-[#9C5B23]/25 px-2 py-0.5 rounded text-[10px] font-bold">
                              <span className="material-symbols-outlined text-[12px]">help</span>Review Needed
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right font-bold text-[#1A1A1A]">{item.quantity}</td>
                        <td className="p-3 text-right text-[#1A1A1A]">{formatINR(item.rate)}</td>
                        <td className="p-3 text-[11.5px]">
                          <div>Lot: {item.batchNumber}</div>
                          <div className={item.isExpiryMissing ? 'text-[#8B2626] font-bold' : 'text-[#78746D]'}>
                            Exp: {item.expiryDate}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {isUncertain && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedUncertainId(item.id); }}
                                className="text-[#1A1A1A] hover:text-[#8C733E] p-1" title="Resolve Match"
                              >
                                <span className="material-symbols-outlined text-[17px]">edit</span>
                              </button>
                            )}
                            {scanStatus !== 'confirmed' && (
                              <button
                                onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                                className="text-[#78746D] hover:text-[#8B2626] p-1" title="Remove"
                              >
                                <span className="material-symbols-outlined text-[17px]">delete</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Match Resolution Panel */}
        {selectedUncertainId && scanStatus === 'review' && (
          <div className="bg-[#FFFFFF] rounded border border-[#1A1A1A]/20 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[14.5px] font-serif font-bold text-[#1A1A1A]">
                Resolve Match: "{items.find(i => i.id === selectedUncertainId)?.extractedName}"
              </h4>
              <button onClick={() => setSelectedUncertainId(null)} className="text-[#78746D] hover:text-[#1A1A1A]">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="relative mb-3">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#78746D] text-[17px]">search</span>
              <input
                type="text"
                value={masterSearchQuery}
                onChange={(e) => setMasterSearchQuery(e.target.value)}
                placeholder="Search catalog by name or SKU..."
                className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/20 rounded pl-8 pr-3 py-1.5 text-[12px] text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {filteredProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => resolveItem(selectedUncertainId, p)}
                  className="w-full text-left p-2 rounded hover:bg-[#F4F1EA] flex justify-between items-center text-[11.5px] font-mono border-b border-[#1A1A1A]/8"
                >
                  <span className="font-bold text-[#1A1A1A]">{p.sku} — {p.name}</span>
                  <span className="text-[#234E3E] font-bold">Assign →</span>
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <p className="text-[11.5px] text-[#78746D] text-center py-3">No products found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Add Manual Item Modal ─────────────────────────────────────────── */}
      {showAddManualModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded max-w-md w-full p-5 shadow-2xl border border-[#1A1A1A]/20">
            <h3 className="text-[16px] font-serif font-bold text-[#1A1A1A] mb-3">Add Manual Inbound Line</h3>
            <form onSubmit={handleAddManualSubmit} className="space-y-3 text-[12.5px]">
              <div>
                <label className="block text-[10px] font-bold text-[#78746D] uppercase mb-1">Select Catalog SKU</label>
                <select
                  value={manualItemForm.productId}
                  onChange={(e) => {
                    const prod = products.find(p => p.id === e.target.value);
                    setManualItemForm({ ...manualItemForm, productId: e.target.value, name: prod?.name || '', rate: prod?.purchasePrice || 0 });
                  }}
                  className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A]"
                  required
                >
                  <option value="">Select SKU...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.sku} — {p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase mb-1">Quantity</label>
                  <input type="number" min="1" value={manualItemForm.qty}
                    onChange={(e) => setManualItemForm({ ...manualItemForm, qty: Number(e.target.value) })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A] font-mono" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase mb-1">Unit Rate (₹)</label>
                  <input type="number" step="0.01" value={manualItemForm.rate}
                    onChange={(e) => setManualItemForm({ ...manualItemForm, rate: Number(e.target.value) })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A] font-mono" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase mb-1">Batch / Lot ID</label>
                  <input type="text" value={manualItemForm.batch}
                    onChange={(e) => setManualItemForm({ ...manualItemForm, batch: e.target.value })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A] font-mono" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase mb-1">Expiry (YYYY-MM-DD)</label>
                  <input type="text" placeholder="2027-12-31" value={manualItemForm.expiry}
                    onChange={(e) => setManualItemForm({ ...manualItemForm, expiry: e.target.value })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A] font-mono" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#1A1A1A]/10">
                <button type="button" onClick={() => setShowAddManualModal(false)} className="px-3 py-1.5 text-[#5C5850] hover:bg-[#F4F1EA] rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-[#1A1A1A] text-[#F9F7F2] font-medium rounded hover:bg-[#2A2A2A]">Append Line Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
