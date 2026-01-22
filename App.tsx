
import React, { useState, useRef, useEffect } from 'react';
import { 
  FileUp, Download, ImageIcon, FileText, Settings, Trash2, 
  CheckCircle2, Loader2, AlertCircle, Layers, Info, 
  SlidersHorizontal, Scissors, Combine, Zap, ArrowLeft,
  ChevronRight, FilePlus, PlusCircle, Sun, Moon, Languages, Search,
  Copy, ExternalLink, Sparkles, LayoutDashboard, ShieldCheck, ZapIcon,
  Lock, Heart, Code, Monitor, FileType, Share2, BrainCircuit,
  Linkedin, Facebook, Mail, MessageCircle
} from 'lucide-react';
import JSZip from 'jszip';
import { PDFDocument, PageSizes } from 'pdf-lib';
import Tesseract from 'tesseract.js';
import { ConversionStatus, ToolType, FileMetadata, ConversionConfig, PDFOutputConfig } from './types';

declare const pdfjsLib: any;

type ViewType = 'HOME' | 'TOOL' | 'PRIVACY' | 'SAFETY' | 'OPENSOURCE';

const translations = {
  bn: {
    title: 'পিডিএফ নোভা',
    subtitle: 'নিরাপদ, দ্রুত এবং শক্তিশালী পিডিএফ টুলকিট',
    heroDesc: 'সহজেই পিডিএফ কনভার্ট, মার্জ, স্প্লিট এবং OCR করুন সরাসরি আপনার ব্রাউজারে। কোনো ডেটা আমাদের সার্ভারে যায় না।',
    dashboard: 'ড্যাশবোর্ড',
    features: 'ফিচার্স',
    support: 'সাপোর্ট',
    process: 'প্রসেস শুরু করুন',
    upload: 'ফাইল সিলেক্ট করুন',
    dragDrop: 'ড্র্যাগ করুন অথবা ক্লিক করুন',
    addMore: 'আরও ফাইল',
    back: 'পিছনে ফিরে যান',
    processing: 'প্রসেসিং হচ্ছে...',
    completed: 'কাজ সম্পন্ন হয়েছে!',
    reset: 'নতুন কাজ শুরু করুন',
    error: 'একটি ত্রুটি দেখা দিয়েছে।',
    pdfToImg: 'পিডিএফ থেকে ছবি',
    imgToPdf: 'ছবি থেকে পিডিএফ',
    merge: 'পিডিএফ মার্জ',
    split: 'পিডিএফ স্প্লিট',
    ocr: 'পিডিএফ OCR (টেক্সট)',
    compress: 'পিডিএফ কমপ্রেস',
    ocrDesc: 'পিডিএফ ছবি থেকে টেক্সট বের করুন',
    pdfToImgDesc: 'পিডিএফ পেজগুলোকে ছবিতে রূপান্তর করুন',
    imgToPdfDesc: 'ছবি থেকে প্রফেশনাল পিডিএফ তৈরি করুন',
    mergeDesc: 'একাধিক পিডিএফ ফাইল এক করুন',
    splitDesc: 'পেজ আলাদা করে নতুন ফাইল তৈরি করুন',
    compressDesc: 'ফাইলের সাইজ কমান মান না হারিয়ে',
    settings: 'প্রসেসিং সেটিংস',
    format: 'ছবির ফরম্যাট',
    resolution: 'রেজোলিউশন কোয়ালিটি',
    splitRange: 'পেজ রেঞ্জ সিলেক্ট করুন',
    from: 'শুরু',
    to: 'শেষ',
    ocrResult: 'এক্সট্রাক্টেড টেক্সট',
    noText: 'কোনো টেক্সট পাওয়া যায়নি।',
    copy: 'টেক্সট কপি করুন',
    downloadWord: 'ওয়ার্ড ডাউনলোড',
    openWith: 'অ্যাপ দিয়ে ওপেন করুন',
    aiSummary: 'এআই সারসংক্ষেপ',
    summarizing: 'সারসংক্ষেপ তৈরি হচ্ছে...',
    copied: 'কপি হয়েছে!',
    unlimited: 'আনলিমিটেড ফ্রি প্রসেসিং',
    secureDesc: 'সম্পূর্ণ প্রাইভেট। আপনার ফাইল ব্রাউজারেই প্রসেস হয়।',
    totalFiles: 'মোট ফাইল',
    totalPages: 'মোট পেজ',
    startNow: 'শুরু করুন',
    pageOf: 'পেজ {current} / {total}',
    extracting: 'টেক্সট বের করা হচ্ছে...',
    converting: 'ছবিতে রূপান্তর হচ্ছে...',
    merging: 'ফাইল এক করা হচ্ছে...',
    splitting: 'আলাদা করা হচ্ছে...',
    privacy: 'প্রাইভেসি পলিসি',
    safety: 'নিরাপত্তা',
    opensource: 'ওপেন সোর্স',
    privacyTitle: 'আপনার গোপনীয়তা আমাদের অগ্রাধিকার',
    privacyContent: 'আমরা আপনার কোনো ফাইল আমাদের সার্ভারে আপলোড করি না। সমস্ত প্রসেসিং সরাসরি আপনার ব্রাউজারের মধ্যে (Client-side) সম্পন্ন হয়। এর মানে হলো আপনার ফাইলগুলো আপনার পিসি বা মোবাইল থেকে কখনোই কোথাও যায় না।',
    safetyTitle: 'নিরাপদ ফাইল প্রসেসিং',
    safetyContent: 'আমরা আধুনিক ওয়েব টেকনোলজি (Web Workers) ব্যবহার করি যাতে প্রসেসিং দ্রুত এবং নিরাপদ হয়। কোনো থার্ড পার্টি ট্র্যাকার বা কুকি আপনার ডেটা সংগ্রহ করে না। আপনি ইন্টারনেট বন্ধ করেও আমাদের অনেক টুল ব্যবহার করতে পারবেন।',
    opensourceTitle: 'স্বচ্ছতা ও ওপেন সোর্স',
    opensourceContent: 'এই প্রজেক্টটি স্বচ্ছতা বজায় রাখতে ওপেন সোর্স লাইব্রেরি (যেমন: pdf-lib, Tesseract.js, JSZip) ব্যবহার করে তৈরি করা হয়েছে। আমরা বিশ্বাস করি ইউজারদের জানার অধিকার আছে তাদের ডেটা কীভাবে ব্যবহৃত হচ্ছে।',
    pdfQuality: 'পিডিএফ কোয়ালিটি',
    pdfDpi: 'রেজোলিউশন (DPI)',
    low: 'লো',
    medium: 'মিডিয়াম',
    high: 'হাই',
    creatingPdf: 'পিডিএফ তৈরি হচ্ছে...',
    shareDenied: 'সিকিউরিটি পলিসির কারণে সরাসরি অ্যাপ ওপেন করা সম্ভব হয়নি। ফাইলটি ডাউনলোড করুন।',
    ocrTip: 'টিপস: ঝকঝকে স্ক্যান করা পিডিএফ ব্যবহার করলে নির্ভুল টেক্সট পাওয়া যায়।',
    navTitle: 'নেভিগেশন',
    connectTitle: 'কানেক্ট ও সাপোর্ট',
    sendSuggestion: 'পরামর্শ পাঠান',
    devWith: 'DEVELOPED WITH ❤️ IN BD'
  },
  en: {
    title: 'PDF Nova',
    subtitle: 'Secure, Fast & Powerful PDF Toolkit',
    heroDesc: 'Easily convert, merge, split, and OCR PDFs directly in your browser. No server logs, 100% private.',
    dashboard: 'Dashboard',
    features: 'Features',
    support: 'Support',
    process: 'Process Now',
    upload: 'Select Files',
    dragDrop: 'Drag & Drop files or click',
    addMore: 'Add More',
    back: 'Go Back',
    processing: 'Processing...',
    completed: 'Task Completed!',
    reset: 'Start New Task',
    error: 'An error occurred.',
    pdfToImg: 'PDF to Image',
    imgToPdf: 'Image to PDF',
    merge: 'Merge PDF',
    split: 'Split PDF',
    ocr: 'PDF OCR (Text)',
    compress: 'Compress PDF',
    ocrDesc: 'Extract text from scanned PDFs',
    pdfToImgDesc: 'Convert PDF pages to high-res images',
    imgToPdfDesc: 'Create PDF from multiple images',
    mergeDesc: 'Combine multiple PDF files',
    splitDesc: 'Separate pages into new files',
    compressDesc: 'Reduce size without losing quality',
    settings: 'Processing Settings',
    format: 'Image Format',
    resolution: 'Resolution Quality',
    splitRange: 'Select Page Range',
    from: 'From',
    to: 'To',
    ocrResult: 'Extracted Text',
    noText: 'No text found.',
    copy: 'Copy Text',
    downloadWord: 'Download Word',
    openWith: 'Open with App',
    aiSummary: 'AI Summary',
    summarizing: 'Generating summary...',
    copied: 'Copied!',
    unlimited: 'Unlimited Free Processing',
    secureDesc: 'Completely private. Files stay in your browser.',
    totalFiles: 'Total Files',
    totalPages: 'Total Pages',
    startNow: 'Get Started',
    pageOf: 'Page {current} of {total}',
    extracting: 'Extracting text...',
    converting: 'Converting pages...',
    merging: 'Merging PDFs...',
    splitting: 'Splitting PDF...',
    privacy: 'Privacy Policy',
    safety: 'Safety',
    opensource: 'Open Source',
    privacyTitle: 'Your Privacy is Our Priority',
    privacyContent: 'We do not upload any of your files to our servers. All processing is done directly within your browser (Client-side). This means your files never leave your device.',
    safetyTitle: 'Secure File Processing',
    safetyContent: 'We use modern Web Workers to ensure processing is fast and secure. No third-party trackers or cookies collect your data. You can even use most of our tools offline once loaded.',
    opensourceTitle: 'Transparency & Open Source',
    opensourceContent: 'This project is built using trusted open-source libraries like pdf-lib, Tesseract.js, and JSZip. We believe users have the right to know how their data is being handled.',
    pdfQuality: 'PDF Quality',
    pdfDpi: 'Resolution (DPI)',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    creatingPdf: 'Creating PDF...',
    shareDenied: 'Could not open app due to security policy. Please use Download instead.',
    ocrTip: 'Tip: Use high-quality scanned PDFs for best accuracy.',
    navTitle: 'NAVIGATION',
    connectTitle: 'CONNECT & SUPPORT',
    sendSuggestion: 'Send Suggestion',
    devWith: 'DEVELOPED WITH ❤️ IN BD'
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [darkMode, setDarkMode] = useState(false);
  const t = translations[lang];

  const [view, setView] = useState<ViewType>('HOME');
  const [activeTool, setActiveTool] = useState<ToolType | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ConversionStatus>(ConversionStatus.IDLE);
  const [progress, setProgress] = useState(0);
  const [statusDetail, setStatusDetail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [imageConfig, setImageConfig] = useState<ConversionConfig>({
    format: 'png',
    quality: 0.85,
    scale: 2
  });

  const [pdfOutputConfig, setPdfOutputConfig] = useState<PDFOutputConfig>({
    quality: 'medium',
    dpi: 150,
    layout: 'fit'
  });

  const [splitRange, setSplitRange] = useState({ start: 1, end: 1 });
  const [maxPages, setMaxPages] = useState(1);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Helper to enhance image for OCR
  const enhanceImageForOCR = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      
      let value = gray;
      if (gray > 180) {
        value = 255; 
      } else if (gray < 100) {
        value = 0; 
      }
      
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []) as File[];
    if (selectedFiles.length === 0) return;

    if (activeTool === 'IMAGE_TO_PDF') {
      const nonImages = selectedFiles.filter(f => !f.type.startsWith('image/'));
      if (nonImages.length > 0) {
        setError(lang === 'bn' ? 'শুধুমাত্র ছবি সিলেক্ট করুন।' : 'Please select image files only.');
        return;
      }
    } else {
      const nonPdfs = selectedFiles.filter(f => f.type !== 'application/pdf');
      if (nonPdfs.length > 0) {
        setError(lang === 'bn' ? 'শুধুমাত্র পিডিএফ সিলেক্ট করুন।' : 'Please select PDF files only.');
        return;
      }
    }

    setFiles(prev => [...prev, ...selectedFiles]);
    setError(null);

    if (activeTool === 'SPLIT_PDF' && selectedFiles.length > 0) {
      try {
        const arrayBuffer = await selectedFiles[0].arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        setMaxPages(pdf.numPages);
        setSplitRange({ start: 1, end: pdf.numPages });
      } catch (err) {
        console.error("Error reading PDF metadata:", err);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (files.length <= 1) {
      setOcrText(null);
      setMaxPages(1);
      setSplitRange({ start: 1, end: 1 });
    }
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const processOCR = async () => {
    if (files.length === 0) return;
    setStatus(ConversionStatus.PROCESSING);
    setProgress(0);
    let fullExtractedText = '';

    try {
      const arrayBuffer = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = Math.min(pdf.numPages, 20);

      for (let i = 1; i <= numPages; i++) {
        setStatusDetail(t.pageOf.replace('{current}', i.toString()).replace('{total}', numPages.toString()));
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.8 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        enhanceImageForOCR(canvas);
        const imgData = canvas.toDataURL('image/png');
        const result = await Tesseract.recognize(imgData, 'ben+eng', {
          logger: m => {
            if (m.status === 'recognizing text') {
              const currentProgress = Math.round(((i - 1) / numPages) * 100 + (m.progress * (100 / numPages)));
              setProgress(currentProgress);
            }
          }
        });
        fullExtractedText += `--- Page ${i} ---\n${result.data.text.trim()}\n\n`;
      }
      setOcrText(fullExtractedText || t.noText);
      setStatus(ConversionStatus.COMPLETED);
      setProgress(100);
      setStatusDetail('');
    } catch (err) {
      console.error(err);
      setError(t.error);
      setStatus(ConversionStatus.ERROR);
    }
  };

  const getWordBlob = () => {
    if (!ocrText) return null;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
          "xmlns:w='urn:schemas-microsoft-com:office:word' "+
          "xmlns='http://www.w3.org/TR/REC-html40'>"+
          "<head><meta charset='utf-8'><title>Export Word</title><style>body { font-family: 'Inter', 'Hind Siliguri', sans-serif; }</style></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + ocrText.replace(/\n/g, '<br>') + footer;
    
    return new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword'
    });
  };

  const downloadAsWord = () => {
    const blob = getWordBlob();
    if (blob) triggerDownload(blob, 'extracted_text.doc');
  };

  const processPDFToImage = async () => {
    if (files.length === 0) return;
    setStatus(ConversionStatus.PROCESSING);
    setProgress(0);
    const zip = new JSZip();

    try {
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const totalPages = pdf.numPages;
        
        for (let i = 1; i <= totalPages; i++) {
          setStatusDetail(t.pageOf.replace('{current}', i.toString()).replace('{total}', totalPages.toString()));
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: imageConfig.scale });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height; canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport }).promise;
          const mimeType = `image/${imageConfig.format}`;
          const imgData = canvas.toDataURL(mimeType, imageConfig.quality);
          const ext = imageConfig.format === 'jpeg' ? 'jpg' : imageConfig.format;
          zip.file(`${file.name.replace('.pdf', '')}_page-${i}.${ext}`, imgData.split(',')[1], { base64: true });
          setProgress(Math.round(((i / totalPages) * 100)));
        }
      }
      setStatusDetail(lang === 'bn' ? 'জিপ ফাইল তৈরি হচ্ছে...' : 'Creating zip file...');
      const content = await zip.generateAsync({ type: 'blob' });
      triggerDownload(content, `converted_images.zip`);
      setStatus(ConversionStatus.COMPLETED);
      setStatusDetail('');
    } catch (err) { setError(t.error); setStatus(ConversionStatus.ERROR); }
  };

  const processImageToPDF = async () => {
    if (files.length === 0) return;
    setStatus(ConversionStatus.PROCESSING);
    setProgress(0);
    setStatusDetail(t.creatingPdf);

    try {
      const pdfDoc = await PDFDocument.create();
      const qualityMap = { low: 0.5, medium: 0.75, high: 0.95 };
      const quality = qualityMap[pdfOutputConfig.quality];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setStatusDetail(t.pageOf.replace('{current}', (i + 1).toString()).replace('{total}', files.length.toString()));
        
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const el = new Image();
            el.onload = () => resolve(el);
            el.onerror = reject;
            el.src = reader.result as string;
          };
          reader.readAsDataURL(file);
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const imageBytes = await fetch(compressedDataUrl).then(res => res.arrayBuffer());
        
        let pdfImage = await pdfDoc.embedJpg(imageBytes);

        const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width: pdfImage.width,
          height: pdfImage.height,
        });

        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      const pdfBytes = await pdfDoc.save();
      triggerDownload(new Blob([pdfBytes]), 'converted_document.pdf');
      setStatus(ConversionStatus.COMPLETED);
      setStatusDetail('');
    } catch (err) {
      console.error(err);
      setError(t.error);
      setStatus(ConversionStatus.ERROR);
    }
  };

  const processMergePDF = async () => {
    if (files.length < 2) return;
    setStatus(ConversionStatus.PROCESSING);
    setStatusDetail(t.merging);
    setProgress(50);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const mergedBytes = await mergedPdf.save();
      triggerDownload(new Blob([mergedBytes]), 'merged_document.pdf');
      setStatus(ConversionStatus.COMPLETED);
      setProgress(100);
      setStatusDetail('');
    } catch (err) { setError(t.error); setStatus(ConversionStatus.ERROR); }
  };

  const processSplitPDF = async () => {
    if (files.length === 0) return;
    setStatus(ConversionStatus.PROCESSING);
    setStatusDetail(t.splitting);
    setProgress(50);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const splitPdf = await PDFDocument.create();
      
      const start = Math.max(1, splitRange.start);
      const end = Math.min(pdf.numPages, splitRange.end);
      const indices = Array.from({ length: end - start + 1 }, (_, i) => i + start - 1);
      
      const sourcePdfDoc = await PDFDocument.load(bytes);
      const copiedPages = await splitPdf.copyPages(sourcePdfDoc, indices);
      copiedPages.forEach(page => splitPdf.addPage(page));
      
      const splitBytes = await splitPdf.save();
      triggerDownload(new Blob([splitBytes]), `split_document.pdf`);
      setStatus(ConversionStatus.COMPLETED);
      setProgress(100);
      setStatusDetail('');
    } catch (err) { setError(t.error); setStatus(ConversionStatus.ERROR); }
  };

  const resetTool = () => {
    setFiles([]);
    setStatus(ConversionStatus.IDLE);
    setProgress(0);
    setStatusDetail('');
    setError(null);
    setOcrText(null);
    setMaxPages(1);
    setSplitRange({ start: 1, end: 1 });
  };

  const navigateTo = (newView: ViewType, tool: ToolType | null = null) => {
    setView(newView);
    setActiveTool(tool);
    resetTool();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toolList = [
    { id: 'PDF_TO_IMAGE', title: t.pdfToImg, desc: t.pdfToImgDesc, icon: ImageIcon, gradient: 'from-blue-500 via-indigo-600 to-purple-700' },
    { id: 'IMAGE_TO_PDF', title: t.imgToPdf, desc: t.imgToPdfDesc, icon: FilePlus, gradient: 'from-emerald-500 via-teal-600 to-cyan-700' },
    { id: 'MERGE_PDF', title: t.merge, desc: t.mergeDesc, icon: Combine, gradient: 'from-indigo-600 via-purple-600 to-pink-600' },
    { id: 'SPLIT_PDF', title: t.split, desc: t.splitDesc, icon: Scissors, gradient: 'from-rose-500 via-pink-600 to-orange-600' },
    { id: 'OCR_PDF', title: t.ocr, desc: t.ocrDesc, icon: Search, gradient: 'from-purple-500 via-violet-600 to-indigo-700' },
    { id: 'COMPRESS_PDF', title: t.compress, desc: t.compressDesc, icon: Zap, gradient: 'from-orange-500 via-amber-600 to-yellow-600' }
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <header className="sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={() => navigateTo('HOME')}
          >
            <div className="bg-gradient-to-br from-indigo-600 to-pink-600 p-3 rounded-2xl shadow-xl shadow-indigo-200/40 dark:shadow-none transition-transform group-hover:scale-110 group-hover:rotate-3">
              <FileText className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter flex flex-col leading-none">
              <span className="text-gradient">
                {t.title}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase">Ultimate Toolkit</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(l => l === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-bold text-sm text-slate-700 dark:text-slate-200"
            >
              <Languages className="w-4 h-4 text-indigo-500" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'EN' : 'BN'}</span>
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 glass hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl shadow-sm transition-all text-slate-700 dark:text-slate-200"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 relative z-10">
        {view === 'HOME' && (
          <div className="space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-4 h-4 animate-pulse" /> Powerful Processing
              </div>
              <h2 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]">
                Professional <br/>
                <span className="text-gradient underline decoration-indigo-200 dark:decoration-indigo-900 underline-offset-8">PDF Toolkit</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                {t.heroDesc}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                   <ShieldCheck className="w-5 h-5 text-emerald-500" /> 100% Privacy Secure
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                   <ZapIcon className="w-5 h-5 text-amber-500" /> Fast Client Processing
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {toolList.map((tool, idx) => (
                <div 
                  key={tool.id}
                  onClick={() => navigateTo('TOOL', tool.id as ToolType)}
                  className="group relative h-72 bg-white dark:bg-slate-800/80 rounded-[3rem] p-10 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_60px_-15px_rgba(99,102,241,0.2)] dark:hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-3 transition-all cursor-pointer overflow-hidden border border-slate-100 dark:border-slate-700/50 animate-in fade-in slide-in-from-bottom-10"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.gradient} opacity-5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
                  <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${tool.gradient} shadow-lg flex items-center justify-center mb-8 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
                    <tool.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 flex items-center justify-between group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.title} 
                    <div className="p-2 rounded-full glass opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all">
                      <ChevronRight className="w-4 h-4 text-indigo-600" />
                    </div>
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed pr-8">{tool.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-[4rem] p-16 text-white shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -mr-64 -mt-64 group-hover:scale-125 transition-transform duration-1000"></div>
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="space-y-6 max-w-2xl text-center lg:text-left">
                  <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-500/20 rounded-full font-black uppercase tracking-tighter text-xs text-indigo-300 border border-indigo-400/20">
                    <LayoutDashboard className="w-4 h-4" /> Professional Statistics
                  </div>
                  <h4 className="text-5xl font-black tracking-tight leading-none">{t.unlimited}</h4>
                  <p className="text-indigo-100/70 text-lg font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                    আমাদের এই টুলটি সম্পূর্ণ ওপেন-সোর্স এবং ব্রাউজার টেকনোলজি ব্যবহার করে। এতে কোনো পেমেন্ট বা লগইন প্রয়োজন নেই।
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-2 text-center">
                    <div className="text-7xl font-black tracking-tighter text-indigo-400 drop-shadow-2xl">∞</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 opacity-60">Tasks Processed</div>
                  </div>
                  <div className="space-y-2 text-center">
                    <div className="text-7xl font-black tracking-tighter text-pink-500 drop-shadow-2xl">0</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-200 opacity-60">Server Storage</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'TOOL' && (
          <div className="space-y-10 animate-in zoom-in-95 duration-500">
            <button 
              onClick={() => navigateTo('HOME')}
              className="group flex items-center gap-3 px-6 py-3 rounded-2xl glass hover:bg-white dark:hover:bg-slate-800 transition-all font-black text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> {t.back}
            </button>

            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-1 space-y-10">
                <div className="bg-white/80 dark:bg-slate-800/80 glass rounded-[3rem] p-12 shadow-2xl shadow-indigo-100 dark:shadow-none animate-in fade-in slide-in-from-left duration-700">
                  <div className="flex items-center justify-between mb-12">
                    <div className="space-y-2">
                       <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                        {toolList.find(t => t.id === activeTool)?.title}
                      </h3>
                      <p className="text-slate-400 dark:text-slate-500 font-bold">{toolList.find(t => t.id === activeTool)?.desc}</p>
                    </div>
                    <div className={`p-5 rounded-[2rem] bg-gradient-to-br ${toolList.find(t => t.id === activeTool)?.gradient} text-white shadow-xl rotate-3`}>
                      {React.createElement(toolList.find(t => t.id === activeTool)?.icon || FileText, { className: 'w-10 h-10' })}
                    </div>
                  </div>

                  {files.length === 0 ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="group relative border-4 border-dashed border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/30 rounded-[3rem] p-24 text-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-white dark:hover:bg-slate-900 transition-all overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        multiple={activeTool === 'MERGE_PDF' || activeTool === 'IMAGE_TO_PDF'}
                        accept={activeTool === 'IMAGE_TO_PDF' ? "image/*" : "application/pdf"} 
                        className="hidden" 
                      />
                      <div className="relative z-10">
                        <div className="bg-gradient-to-r from-indigo-600 to-pink-600 w-24 h-24 rounded-3xl shadow-2xl shadow-indigo-300/40 dark:shadow-none flex items-center justify-center mx-auto mb-10 group-hover:scale-110 group-hover:rotate-12 transition-all">
                          <FileUp className="w-12 h-12 text-white" />
                        </div>
                        <h4 className="text-3xl font-black mb-3 text-slate-800 dark:text-white tracking-tight">{t.upload}</h4>
                        <p className="text-slate-400 dark:text-slate-500 font-bold tracking-wide">{t.dragDrop}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {files.map((f, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-[2rem] p-6 flex items-center gap-5 group/file animate-in fade-in zoom-in duration-300 hover:shadow-xl hover:-translate-y-1 transition-all">
                          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-indigo-600 shadow-inner">
                            {f.type.startsWith('image/') ? <ImageIcon className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                          </div>
                          <div className="flex-1 truncate space-y-1">
                            <div className="font-black text-slate-800 dark:text-slate-100 truncate text-lg tracking-tight">{f.name}</div>
                            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{(f.size / (1024 * 1024)).toFixed(2)} MB • RAW DATA</div>
                          </div>
                          <button onClick={() => removeFile(i)} className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all">
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>
                      ))}
                      {(activeTool === 'MERGE_PDF' || activeTool === 'IMAGE_TO_PDF') && (
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="border-4 border-dashed border-slate-100 dark:border-slate-700/50 p-8 rounded-[2rem] text-slate-300 dark:text-slate-600 font-black flex flex-col items-center justify-center gap-3 hover:border-indigo-300 hover:text-indigo-500 dark:hover:border-indigo-700 transition-all min-h-[140px]"
                        >
                           <PlusCircle className="w-8 h-8" />
                           <span className="text-xs uppercase tracking-[0.2em]">{t.addMore}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {activeTool === 'OCR_PDF' && ocrText && (
                  <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700">
                    <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 rounded-xl flex items-center gap-4">
                      <Info className="w-6 h-6 text-amber-500" />
                      <p className="text-sm font-bold text-amber-800 dark:text-amber-200">{t.ocrTip}</p>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-800/80 glass rounded-[3rem] p-12 shadow-2xl">
                      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <div className="p-4 rounded-2xl bg-violet-100 dark:bg-violet-900/30 text-violet-600">
                             <FileType className="w-7 h-7" />
                          </div>
                          <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{t.ocrResult}</h4>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <button 
                            onClick={downloadAsWord}
                            className="flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all shadow-xl hover:-translate-y-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
                          >
                            <Download className="w-5 h-5" />
                            {t.downloadWord}
                          </button>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(ocrText);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all shadow-xl hover:-translate-y-1 ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-indigo-600 dark:hover:bg-indigo-400'}`}
                          >
                            {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            {copied ? t.copied : t.copy}
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute -top-4 -left-4 w-20 h-20 bg-violet-500 opacity-10 blur-2xl"></div>
                        <textarea 
                          readOnly 
                          value={ocrText}
                          className="w-full h-[600px] bg-slate-50/50 dark:bg-slate-900/50 border dark:border-slate-700/50 rounded-[2.5rem] p-10 text-slate-700 dark:text-slate-300 font-mono text-lg leading-relaxed shadow-inner focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all custom-scrollbar"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {files.length > 0 && (
                <div className="w-full lg:w-[400px] space-y-10 shrink-0">
                  <div className="bg-white/80 dark:bg-slate-800/80 glass rounded-[3rem] p-12 shadow-2xl animate-in slide-in-from-right duration-700">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500">
                        <Settings className="w-6 h-6" />
                      </div>
                      <h4 className="text-2xl font-black dark:text-white tracking-tight">{t.settings}</h4>
                    </div>
                    <div className="space-y-10">
                      {activeTool === 'PDF_TO_IMAGE' && (
                        <>
                          <div className="space-y-5">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block">{t.format}</label>
                            <div className="grid grid-cols-3 gap-3 p-2 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl shadow-inner">
                              {['png', 'jpeg', 'webp'].map(f => (
                                <button 
                                  key={f} 
                                  onClick={() => setImageConfig(prev => ({...prev, format: f as any}))}
                                  className={`py-4 text-xs font-black uppercase rounded-xl transition-all ${imageConfig.format === f ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-300' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                  {f === 'jpeg' ? 'JPG' : f}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-8">
                            <div className="flex justify-between items-center">
                              <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{t.resolution}</label>
                              <span className="text-indigo-600 dark:text-indigo-400 font-black text-lg">{imageConfig.scale}x HighRes</span>
                            </div>
                            <input 
                              type="range" min="1" max="4" step="0.5" 
                              value={imageConfig.scale}
                              onChange={(e) => setImageConfig(prev => ({...prev, scale: parseFloat(e.target.value)}))}
                              className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400" 
                            />
                          </div>
                        </>
                      )}

                      {activeTool === 'IMAGE_TO_PDF' && (
                        <>
                          <div className="space-y-5">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block">{t.pdfQuality}</label>
                            <div className="grid grid-cols-3 gap-3 p-2 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl shadow-inner">
                              {['low', 'medium', 'high'].map(q => (
                                <button 
                                  key={q} 
                                  onClick={() => setPdfOutputConfig(prev => ({...prev, quality: q as any}))}
                                  className={`py-4 text-xs font-black uppercase rounded-xl transition-all ${pdfOutputConfig.quality === q ? 'bg-white dark:bg-slate-700 shadow-md text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                  {q === 'low' ? t.low : q === 'medium' ? t.medium : t.high}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-8">
                            <div className="flex justify-between items-center">
                              <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{t.pdfDpi}</label>
                              <span className="text-emerald-600 dark:text-emerald-400 font-black text-lg">{pdfOutputConfig.dpi} DPI</span>
                            </div>
                            <div className="flex gap-2">
                                {[72, 150, 300, 600].map(val => (
                                    <button 
                                        key={val}
                                        onClick={() => setPdfOutputConfig(prev => ({...prev, dpi: val}))}
                                        className={`flex-1 py-3 text-[10px] font-black rounded-xl border-2 transition-all ${pdfOutputConfig.dpi === val ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-600' : 'border-slate-100 dark:border-slate-700 text-slate-400'}`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                          </div>
                        </>
                      )}

                      {activeTool === 'SPLIT_PDF' && (
                        <div className="space-y-8">
                          <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block">{t.splitRange}</label>
                          <div className="flex gap-4">
                            <div className="flex-1 space-y-3">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.from}</span>
                              <input 
                                type="number" 
                                min="1" 
                                max={maxPages}
                                value={splitRange.start}
                                onChange={(e) => setSplitRange(prev => ({...prev, start: parseInt(e.target.value) || 1}))}
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-5 font-black text-xl text-indigo-600 dark:text-indigo-400 shadow-inner transition-all outline-none"
                              />
                            </div>
                            <div className="flex-1 space-y-3">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.to}</span>
                              <input 
                                type="number" 
                                min="1" 
                                max={maxPages}
                                value={splitRange.end}
                                onChange={(e) => setSplitRange(prev => ({...prev, end: parseInt(e.target.value) || 1}))}
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-5 font-black text-xl text-indigo-600 dark:text-indigo-400 shadow-inner transition-all outline-none"
                              />
                            </div>
                          </div>
                          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex justify-between items-center">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{t.totalPages}</span>
                            <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300">{maxPages}</span>
                          </div>
                        </div>
                      )}
                      {activeTool === 'OCR_PDF' && (
                        <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-[2rem] border-2 border-indigo-100 dark:border-indigo-800/20 space-y-4">
                          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl w-fit shadow-md text-indigo-600">
                             <Sparkles className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                            {lang === 'bn' ? 'আমাদের হাই-পাওয়ারড OCR ইঞ্জিন ব্যবহারের জন্য ধন্যবাদ। এটি আপনার পিসি থেকেই কাজ করে।' : 'Using high-powered client-side OCR engine. Zero data leaves your machine.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-6">
                    {status === ConversionStatus.PROCESSING ? (
                      <div className="bg-slate-900 dark:bg-indigo-950 rounded-[3rem] p-10 shadow-3xl space-y-8 animate-pulse-slow">
                         <div className="flex justify-between items-end">
                            <div className="space-y-2">
                               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">{t.processing}</span>
                               <div className="text-xl font-black text-white">{statusDetail || (lang === 'bn' ? 'অপেক্ষা করুন...' : 'Processing Files...')}</div>
                            </div>
                            <span className="text-5xl font-black text-indigo-400 tabular-nums leading-none">{progress}%</span>
                         </div>
                         <div className="h-5 bg-white/10 rounded-full overflow-hidden p-1 shadow-inner">
                            <div className="h-full bg-gradient-to-r from-indigo-500 via-pink-500 to-indigo-500 rounded-full transition-all duration-500 animate-pulse" style={{ width: `${progress}%` }} />
                         </div>
                      </div>
                    ) : status === ConversionStatus.COMPLETED ? (
                      <div className="bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-100 dark:border-emerald-800/20 rounded-[3rem] p-12 text-center animate-in zoom-in-95 duration-500 space-y-8 shadow-2xl shadow-emerald-100 dark:shadow-none">
                         <div className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200 dark:shadow-none">
                            <CheckCircle2 className="w-12 h-12" />
                         </div>
                         <div className="space-y-3">
                            <div className="text-3xl font-black text-emerald-900 dark:text-emerald-300 tracking-tighter">{t.completed}</div>
                            <p className="text-emerald-600 dark:text-emerald-500/70 font-bold leading-relaxed">{lang === 'bn' ? 'ফাইল প্রসেস শেষ হয়েছে। চেক করুন!' : 'Your files have been processed successfully.'}</p>
                         </div>
                         <button 
                          onClick={resetTool} 
                          className="w-full bg-emerald-600 text-white py-6 rounded-[2rem] font-black text-lg shadow-xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition-all active:scale-95"
                         >
                          {t.reset}
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          if (activeTool === 'OCR_PDF') processOCR();
                          else if (activeTool === 'PDF_TO_IMAGE') processPDFToImage();
                          else if (activeTool === 'IMAGE_TO_PDF') processImageToPDF();
                          else if (activeTool === 'MERGE_PDF') processMergePDF();
                          else if (activeTool === 'SPLIT_PDF') processSplitPDF();
                        }}
                        className={`w-full bg-gradient-to-r ${toolList.find(t => t.id === activeTool)?.gradient} text-white py-8 rounded-[3rem] font-black text-2xl shadow-2xl shadow-indigo-300/40 dark:shadow-none hover:shadow-indigo-500/50 transition-all hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-5 group/btn`}
                      >
                        <Zap className="w-8 h-8 group-hover/btn:animate-bounce" /> {t.process}
                      </button>
                    )}
                    {error && (
                      <div className="p-8 bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-100 dark:border-rose-800/20 rounded-[2.5rem] flex items-start gap-4 text-rose-600 dark:text-rose-400 text-sm font-bold shadow-xl animate-in shake duration-500">
                        <AlertCircle className="w-7 h-7 shrink-0" />
                        <span className="leading-relaxed">{error}</span>
                        <button onClick={() => setError(null)} className="ml-auto p-2 opacity-50 hover:opacity-100 transition-opacity">×</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {(view === 'PRIVACY' || view === 'SAFETY' || view === 'OPENSOURCE') && (
          <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <button 
              onClick={() => navigateTo('HOME')}
              className="group flex items-center gap-3 px-6 py-3 rounded-2xl glass hover:bg-white dark:hover:bg-slate-800 transition-all font-black text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> {t.back}
            </button>

            <div className="bg-white/80 dark:bg-slate-800/80 glass rounded-[3rem] p-12 md:p-20 shadow-2xl space-y-12">
               <div className="flex items-center gap-6">
                 <div className="p-6 rounded-[2rem] bg-indigo-600 text-white shadow-xl">
                   {view === 'PRIVACY' && <Lock className="w-10 h-10" />}
                   {view === 'SAFETY' && <ShieldCheck className="w-10 h-10" />}
                   {view === 'OPENSOURCE' && <Code className="w-10 h-10" />}
                 </div>
                 <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                   {view === 'PRIVACY' && t.privacyTitle}
                   {view === 'SAFETY' && t.safetyTitle}
                   {view === 'OPENSOURCE' && t.opensourceTitle}
                 </h2>
               </div>
               
               <div className="prose prose-indigo dark:prose-invert max-w-none">
                 <p className="text-2xl font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                   {view === 'PRIVACY' && t.privacyContent}
                   {view === 'SAFETY' && t.safetyContent}
                   {view === 'OPENSOURCE' && t.opensourceContent}
                 </p>
               </div>

               <div className="pt-10 border-t dark:border-slate-700 flex flex-wrap gap-6">
                 <div className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-widest text-xs">
                    <CheckCircle2 className="w-5 h-5" /> Trusted by Thousands
                 </div>
                 <div className="flex items-center gap-3 text-indigo-500 font-black uppercase tracking-widest text-xs">
                    <ShieldCheck className="w-5 h-5" /> ISO Standard Security
                 </div>
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 border-t dark:border-slate-800 py-10 relative overflow-hidden bg-white/50 dark:bg-slate-900/50 glass">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Column 1: Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 dark:bg-white p-2.5 rounded-xl shadow-lg cursor-pointer" onClick={() => navigateTo('HOME')}>
                  <FileText className="text-white dark:text-slate-900 w-5 h-5" />
                </div>
                <h1 className="text-2xl font-black tracking-tighter cursor-pointer" onClick={() => navigateTo('HOME')}>
                  <span className="text-gradient">
                    {t.title}
                  </span>
                </h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-sm">
                বিশ্বসেরা পিডিএফ টুলকিট। নিরাপদ এবং ১০০% ফ্রি প্রসেসিং। সরাসরি আপনার ব্রাউজারে কাজ করে।
              </p>
            </div>

            {/* Column 2: Navigation */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">{t.navTitle}</h4>
              <ul className="space-y-4">
                <li><button onClick={() => navigateTo('PRIVACY')} className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">{t.privacy}</button></li>
                <li><button onClick={() => navigateTo('SAFETY')} className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">{t.safety}</button></li>
                <li><button onClick={() => navigateTo('OPENSOURCE')} className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">{t.opensource}</button></li>
              </ul>
            </div>

            {/* Column 3: Connect & Support */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-pink-600 dark:text-pink-400">{t.connectTitle}</h4>
              <div className="flex items-center gap-4">
                <a href="mailto:gourobsaha2319@gmail.com" className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all border border-slate-100 dark:border-slate-700">
                  <Mail className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/gourob-saha-9895442a9/" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all border border-slate-100 dark:border-slate-700">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://facebook.com/profile.php?id=100093706797985" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all border border-slate-100 dark:border-slate-700">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
              <a 
                href="https://m.me/gourob23" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-indigo-200 dark:shadow-none hover:-translate-y-1 transition-all"
              >
                <MessageCircle className="w-4 h-4" /> {t.sendSuggestion}
              </a>
            </div>

            {/* Column 4: Attribution */}
            <div className="space-y-6 lg:text-right">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">{t.devWith}</div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold">
                © ২০২৫ {t.title} PRO. <br/> 
                <span className="opacity-50 mt-1 inline-block">All Rights Reserved</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
