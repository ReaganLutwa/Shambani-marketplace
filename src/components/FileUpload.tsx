import { useState, useRef, useCallback } from 'react';
import { Upload, Camera, X, FileText, Image, Printer, MessageCircle } from 'lucide-react';

interface FileUploadProps {
  onOrderReady: (files: UploadedFile[], config: PrintConfig) => void;
}

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  pages: number;
}

export interface PrintConfig {
  printType: 'bw' | 'color';
  copies: number;
  doubleSided: boolean;
  binding: 'none' | 'comb' | 'staple';
}

const BW_PRICE = 500;
const COLOR_PRICE = 1500;
const BINDING_PRICES = { none: 0, comb: 5000, staple: 1000 };

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function estimatePages(file: File): Promise<number> {
  return new Promise((resolve) => {
    if (file.type === 'application/pdf') {
      const estimated = Math.max(1, Math.round(file.size / 30720));
      resolve(Math.min(estimated, 500));
    } else if (file.type.startsWith('image/')) {
      resolve(1);
    } else {
      const estimated = Math.max(1, Math.round(file.size / 15360));
      resolve(Math.min(estimated, 200));
    }
  });
}

export default function FileUpload({ onOrderReady }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [config, setConfig] = useState<PrintConfig>({
    printType: 'bw',
    copies: 1,
    doubleSided: false,
    binding: 'none',
  });
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError(null);

    const newFiles: UploadedFile[] = [];
    for (const file of Array.from(fileList)) {
      const isValid =
        file.type === 'application/pdf' ||
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type.startsWith('image/');

      if (!isValid) {
        setError(`Skipped "${file.name}" — unsupported file type. Only PDF, Word, and images are allowed.`);
        continue;
      }

      // File size limit: 10MB
      if (file.size > 10 * 1024 * 1024) {
        setError(`"${file.name}" is too large. Max file size is 10MB.`);
        continue;
      }

      const pages = await estimatePages(file);
      let preview: string | undefined;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }

      newFiles.push({
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview,
        pages,
      });
    }

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
    }
    setUploading(false);

    // Reset file inputs so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const totalPages = files.reduce((sum, f) => sum + f.pages * config.copies, 0);
  const pricePerPage = config.printType === 'bw' ? BW_PRICE : COLOR_PRICE;
  const bindingCost = files.length > 0 ? BINDING_PRICES[config.binding] * files.length : 0;
  const subtotal = totalPages * pricePerPage;
  const total = subtotal + bindingCost;

  const handleSendToWhatsApp = () => {
    if (files.length === 0) return;
    onOrderReady(files, config);
  };

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') return <FileText className="w-8 h-8 text-red-400" />;
    if (type.startsWith('image/')) return <Image className="w-8 h-8 text-blue-400" />;
    return <FileText className="w-8 h-8 text-blue-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        id="file-upload-input"
        type="file"
        multiple
        accept=".pdf,.doc,.docx,image/*"
        onChange={e => processFiles(e.target.files)}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        id="camera-upload-input"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={e => processFiles(e.target.files)}
        className="hidden"
      />

      {/* Upload Area — CHANGED from <label> to <div> to fix drag-and-drop conflicts */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 select-none ${
          isDragging
            ? 'border-emerald-400 bg-emerald-500/5'
            : 'border-[#334155] bg-[#1E293B] hover:border-emerald-500/50 hover:bg-emerald-500/5 active:border-emerald-400'
        }`}
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 pointer-events-none">
          <Upload className="w-8 h-8 text-emerald-400" />
        </div>
        <p className="text-[#E2E8F0] font-medium mb-1 pointer-events-none">
          {uploading ? 'Processing files...' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-[#94A3B8] mb-4 pointer-events-none">or click to browse</p>
        <p className="text-xs text-[#64748B] pointer-events-none">Supports: PDF, Word, JPG, PNG (max 10MB each)</p>
      </div>

      {/* Camera Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#334155] text-[#E2E8F0] rounded-xl text-sm hover:bg-[#475569] active:bg-[#475569] transition-colors cursor-pointer select-none"
        >
          <Camera className="w-4 h-4" />
          Take a Photo
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
          <span className="shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[#E2E8F0] flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            Files to Print ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map(f => (
              <div key={f.id} className="flex items-center gap-3 bg-[#1E293B] border border-[#334155] rounded-xl p-3">
                {f.preview ? (
                  <img src={f.preview} alt={f.name} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  getFileIcon(f.type)
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#E2E8F0] truncate">{f.name}</p>
                  <p className="text-xs text-[#94A3B8]">{formatBytes(f.size)} · ~{f.pages} pages</p>
                </div>
                <button
                  onClick={() => removeFile(f.id)}
                  className="p-1.5 rounded-lg text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Print Options */}
      {files.length > 0 && (
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 space-y-4">
          <h4 className="text-sm font-semibold text-[#E2E8F0]">Print Options</h4>

          {/* Print Type */}
          <div>
            <label className="text-xs text-[#94A3B8] mb-2 block">Print Type</label>
            <div className="flex gap-2">
              {([
                { key: 'bw' as const, label: 'Black & White', price: `UGX ${BW_PRICE}/page` },
                { key: 'color' as const, label: 'Color', price: `UGX ${COLOR_PRICE}/page` },
              ]).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setConfig(c => ({ ...c, printType: opt.key }))}
                  type="button"
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium border transition-all ${
                    config.printType === opt.key
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                      : 'bg-[#0F172A] border-[#334155] text-[#94A3B8] hover:border-[#475569]'
                  }`}
                >
                  <div>{opt.label}</div>
                  <div className="text-xs text-[#64748B] mt-0.5">{opt.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Copies */}
          <div>
            <label className="text-xs text-[#94A3B8] mb-2 block">Copies: <span className="text-[#E2E8F0] font-semibold">{config.copies}</span></label>
            <input
              type="range"
              min="1"
              max="50"
              value={config.copies}
              onChange={e => setConfig(c => ({ ...c, copies: parseInt(e.target.value) }))}
              className="w-full h-2 bg-[#334155] rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-[#64748B] mt-1"><span>1</span><span>25</span><span>50</span></div>
          </div>

          {/* Binding */}
          <div>
            <label className="text-xs text-[#94A3B8] mb-2 block">Binding</label>
            <div className="flex gap-2">
              {([
                { key: 'none' as const, label: 'None', price: 'Free' },
                { key: 'staple' as const, label: 'Staple', price: 'UGX 1,000' },
                { key: 'comb' as const, label: 'Comb', price: 'UGX 5,000' },
              ]).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setConfig(c => ({ ...c, binding: opt.key }))}
                  type="button"
                  className={`flex-1 py-2.5 px-3 rounded-xl text-sm border transition-all ${
                    config.binding === opt.key
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                      : 'bg-[#0F172A] border-[#334155] text-[#94A3B8] hover:border-[#475569]'
                  }`}
                >
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-xs text-[#64748B]">{opt.price}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Price Summary */}
      {files.length > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-emerald-400 mb-3">Price Estimate</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[#94A3B8]">
              <span>Pages ({totalPages} × {config.printType === 'bw' ? 'B&W' : 'Color'})</span>
              <span className="text-[#E2E8F0]">UGX {subtotal.toLocaleString()}</span>
            </div>
            {bindingCost > 0 && (
              <div className="flex justify-between text-[#94A3B8]">
                <span>Binding ({files.length} file{files.length > 1 ? 's' : ''})</span>
                <span className="text-[#E2E8F0]">UGX {bindingCost.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-emerald-500/20 pt-2 flex justify-between font-semibold">
              <span className="text-[#E2E8F0]">Total Estimate</span>
              <span className="text-emerald-400 text-lg">UGX {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Send Button */}
      {files.length > 0 && (
        <button
          onClick={handleSendToWhatsApp}
          type="button"
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <MessageCircle className="w-5 h-5" />
          Send Order to WhatsApp
        </button>
      )}
    </div>
  );
}
