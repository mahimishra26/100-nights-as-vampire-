import { useState } from 'react';
import { PYTHON_FILES } from '../data/pythonSource';
import { Download, Copy, Check, Terminal, FolderCode, X, BookOpen, Play } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface PythonHubModalProps {
  onClose: () => void;
}

export function PythonHubModal({ onClose }: PythonHubModalProps) {
  const [selectedFile, setSelectedFile] = useState(PYTHON_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('100_nights_vampire');
      
      PYTHON_FILES.forEach((f) => {
        folder?.file(f.filename, f.code);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, '100_nights_vampire.zip');
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl rounded-2xl bg-[#13111a] border-2 border-red-700/80 shadow-[0_0_70px_rgba(220,38,38,0.35)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950 via-[#231525] to-[#120f1c] px-6 py-4 border-b border-red-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-black/50 border border-red-700/60 text-red-400">
              <FolderCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-red-100 tracking-wide flex items-center gap-2">
                <span>100 NIGHTS AS A VAMPIRE</span>
                <span className="text-xs px-2 py-0.5 rounded bg-red-900/60 text-red-300 font-mono font-normal border border-red-700/70">
                  Python + Pygame
                </span>
              </h2>
              <p className="text-xs text-[#bdaab3] font-serif">
                Standalone source code, modular architecture, and instant local execution package.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-800 to-rose-700 hover:from-red-700 hover:to-rose-600 text-white font-cinzel font-bold text-xs tracking-wider shadow-lg shadow-red-950/50 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>{isZipping ? 'Bundling...' : 'Download Game (.zip)'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#241a26] hover:bg-[#3d243a] text-gray-400 hover:text-white border border-[#482e42] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Start Terminal Guide Banner */}
        <div className="bg-[#0b0a10] px-6 py-3 border-b border-[#2d2130] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-400">
            <Terminal className="w-4 h-4" />
            <span className="text-[#e2d8ce] font-sans font-semibold">How to run locally:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3 py-1 rounded bg-[#16141f] border border-[#3b2b3a] text-[#a9d9b4] flex items-center gap-2">
              <span className="text-[#8e7a85] font-sans">Step 1:</span>
              <span>pip install pygame</span>
            </div>
            <div className="px-3 py-1 rounded bg-[#16141f] border border-[#3b2b3a] text-[#f2ce77] flex items-center gap-2">
              <span className="text-[#8e7a85] font-sans">Step 2:</span>
              <span>python main.py</span>
            </div>
          </div>
        </div>

        {/* File Browser Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* File list sidebar */}
          <div className="md:col-span-4 bg-[#100e17] border-r border-[#2d1e2c] p-3 overflow-y-auto max-h-[58vh] space-y-1">
            <div className="text-[11px] font-cinzel font-bold text-[#8d7c86] px-2 py-1 uppercase tracking-wider">
              Python Modules (13 Files)
            </div>
            {PYTHON_FILES.map((file) => (
              <button
                key={file.filename}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex flex-col gap-0.5 cursor-pointer ${
                  selectedFile.filename === file.filename
                    ? 'bg-red-950/70 border border-red-700/80 text-red-100 font-semibold shadow'
                    : 'text-[#baa9b3] hover:bg-[#1c1827] hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{file.filename}</span>
                  {file.filename === 'main.py' && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Entry
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-sans text-[#8e7e88] truncate">
                  {file.description}
                </span>
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="md:col-span-8 bg-[#09080e] flex flex-col overflow-hidden">
            <div className="px-4 py-2 bg-[#14111d] border-b border-[#2b1f2b] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-[#dcd1c8]">
                <BookOpen className="w-3.5 h-3.5 text-red-400" />
                <span>{selectedFile.path}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#20192a] hover:bg-[#342442] text-xs font-cinzel text-gray-200 border border-[#48334a] cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="flex-1 p-4 overflow-auto text-xs font-mono text-[#cebeab] leading-relaxed select-text bg-[#09080e]">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0d0c13] border-t border-[#2d1e2c] flex items-center justify-between text-xs font-serif text-[#9d8a95]">
          <span>
            Fully compatible with Python 3.8+ on Windows, macOS, and Linux.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-lg bg-[#241a28] hover:bg-[#3a253d] text-gray-200 border border-[#4d324c] font-cinzel text-xs cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
