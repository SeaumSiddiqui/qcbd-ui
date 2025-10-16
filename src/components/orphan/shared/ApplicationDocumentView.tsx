import React, { useRef, useEffect } from 'react';
import { X, Printer, Download, Maximize2 } from 'lucide-react';
import { OrphanApplication } from '../../../types';
import { Button } from '../../ui/Button';
import { generateApplicationDocumentHTML } from '../../../utils/document';

interface ApplicationDocumentViewProps {
  application: OrphanApplication;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationDocumentView: React.FC<ApplicationDocumentViewProps> = ({
  application,
  isOpen,
  onClose
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isOpen && iframeRef.current) {
      const iframe = iframeRef.current;
      const htmlContent = generateApplicationDocumentHTML(application);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }
    }
  }, [isOpen, application]);

  if (!isOpen) return null;

  const handlePrint = () => {
    const htmlContent = generateApplicationDocumentHTML(application);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleDownload = () => {
    const htmlContent = generateApplicationDocumentHTML(application);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = `${application.primaryInformation?.fullName || 'Application'}_Form.html`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFullscreen = () => {
    const htmlContent = generateApplicationDocumentHTML(application);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      {/* Modal Container - Much Larger */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-[95vw] h-[95vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Application Document Preview</h2>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreen}
              className="flex items-center gap-2"
            >
              <Maximize2 className="h-4 w-4" />
              <span>Open in New Tab</span>
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Close (ESC)"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Document Content - Rendered in iframe */}
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-4">
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0 bg-white rounded shadow-lg"
            title="Application Document"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      </div>
    </div>
  );
};
