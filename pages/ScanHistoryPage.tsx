import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';//hi
import { ScanResult } from '../types';
import { getScanHistory, deleteScanHistoryItem, clearScanHistory } from '../services/localStorageService';
import Alert from '../components/Alert';

const ScanHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setHistory(getScanHistory());
  }, []);

  const viewScanDetails = (scan: ScanResult) => {
    setSelectedScan(scan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedScan(null);
  };

  const handleDelete = (id: string) => {
    deleteScanHistoryItem(id);
    setHistory(getScanHistory());
  };

  const handleClearAll = () => {
    setShowClearConfirm(true);
  };

  const confirmClearAll = () => {
    clearScanHistory();
    setHistory([]);
    setShowClearConfirm(false);
  };

  const cancelClearAll = () => setShowClearConfirm(false);

  if (history.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-6">Scan History</h2>
        <Alert type="info" message="No scan history yet. Perform a plant scan to see it here." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Scan History</h2>
        {history.length > 0 && (
          <button onClick={handleClearAll} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Clear All</button>
        )}
      </div>
      <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
        Review your past plant health scans. Click on an entry to see detailed diagnosis and care suggestions.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((scan) => {
          const d = scan.diagnosis;
          const statusColors = {
            Healthy: 'bg-green-400 text-white',
            Diseased: 'bg-red-400 text-white',
            NeedsAttention: 'bg-yellow-300 text-yellow-900',
            Unknown: 'bg-gray-300 text-gray-700',
          };
          return (
          <Card 
            key={scan.id} 
            onClick={() => viewScanDetails(scan)}
              className={`transform hover:scale-105 transition-transform duration-300 relative overflow-visible bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 border-2 border-green-200 shadow-xl animate-fade-in`}
          >
              <button onClick={e => { e.stopPropagation(); handleDelete(scan.id); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-20" title="Delete">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl drop-shadow-lg">{d.plantEmoji || '🪴'}</span>
                <span className="text-lg font-bold text-green-800 truncate">{d.plantName || 'Unknown Plant'}</span>
                {typeof d.plantConfidencePercent === 'number' && (
                  <span className="ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500 text-white animate-pulse">{d.plantConfidencePercent}%</span>
                )}
              </div>
              <img src={scan.imagePreviewUrl} alt="Scanned plant" className="w-full h-40 object-cover rounded-md mb-3 border border-green-100 shadow" />
              <div className="flex flex-wrap gap-2 mb-2">
                {d.statusTag && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow ${statusColors[d.statusTag] || 'bg-gray-200 text-gray-700'} animate-glow`}>{d.statusTag}</span>
                )}
                {d.diseaseName && d.diseaseName !== 'N/A' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-xs shadow animate-pulse">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.414 1.415M5.636 5.636l1.414 1.414m11.314 11.314l1.414 1.415M12 8v4l3 3" /></svg>
                    {d.diseaseName}
                  </span>
                )}
              </div>
              {typeof d.plantConfidencePercent === 'number' && (
                <div className="w-full h-2 bg-green-100 rounded-full mb-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-green-400 via-lime-400 to-yellow-300 transition-all duration-700" style={{ width: `${d.plantConfidencePercent}%` }}></div>
                </div>
              )}
              <div className="text-sm text-gray-700 mb-1"><strong>Date:</strong> {new Date(scan.timestamp).toLocaleDateString()}</div>
              <div className="text-sm text-green-700 mb-1">
                <strong>Care Tip:</strong> {Array.isArray(d.careSuggestions) && d.careSuggestions.length > 0 ? d.careSuggestions[0] : (typeof d.careSuggestions === 'string' ? d.careSuggestions.split('\n')[0] : 'N/A')}
              </div>
          </Card>
          );
        })}
      </div>

      {selectedScan && (() => {
        const d = selectedScan.diagnosis;
        const statusColors = {
          Healthy: 'bg-green-500 text-white',
          Diseased: 'bg-red-500 text-white',
          NeedsAttention: 'bg-yellow-400 text-yellow-900',
          Unknown: 'bg-gray-400 text-white',
        };
        return (
          <Modal isOpen={isModalOpen} onClose={closeModal} title={
            <div className="flex items-center gap-3">
              <span className="text-2xl">{d.plantEmoji || '🪴'}</span>
              <span className="font-bold text-green-800 text-xl">{d.plantName || 'Unknown Plant'}</span>
              <span className="text-gray-500 text-base">({new Date(selectedScan.timestamp).toLocaleString()})</span>
            </div>
          } size="lg">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-green-700 mb-2">Scanned Image</h4>
                <img src={selectedScan.imagePreviewUrl} alt="Scanned plant" className="w-full rounded-lg shadow-md object-contain max-h-96 border border-green-200" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-green-700 mb-2">AI Diagnosis</h4>
                <div className="space-y-3 text-gray-700">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {d.statusTag && (
                      <span className={`px-4 py-1 rounded-full text-sm font-bold shadow ${statusColors[d.statusTag] || 'bg-gray-200 text-gray-700'} animate-glow`}>{d.statusTag}</span>
                    )}
                    {d.diseaseName && d.diseaseName !== 'N/A' && (
                      <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-sm shadow animate-pulse">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.414 1.415M5.636 5.636l1.414 1.414m11.314 11.314l1.414 1.415M12 8v4l3 3" /></svg>
                        {d.diseaseName}
                      </span>
                    )}
                  </div>
                  {typeof d.plantConfidencePercent === 'number' && (
                    <div className="mb-2">
                      <span className="text-green-700 font-semibold">Plant ID Confidence:</span>
                      <div className="w-full h-3 bg-green-100 rounded-full mt-1">
                        <div className="h-3 rounded-full bg-gradient-to-r from-green-400 via-lime-400 to-yellow-300 transition-all duration-700" style={{ width: `${d.plantConfidencePercent}%` }}></div>
                      </div>
                      <span className="text-green-800 font-bold ml-2">{d.plantConfidencePercent}%</span>
                    </div>
                  )}
                  {typeof d.confidencePercent === 'number' && (
                    <div className="mb-2">
                      <span className="text-blue-700 font-semibold">Diagnosis Confidence:</span>
                      <div className="w-full h-3 bg-blue-100 rounded-full mt-1">
                        <div className="h-3 rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-green-300 transition-all duration-700" style={{ width: `${d.confidencePercent}%` }}></div>
                      </div>
                      <span className="text-blue-700 font-bold ml-2">{d.confidencePercent}%</span>
                    </div>
                  )}
                  <div><strong>Condition:</strong> {d.condition || 'N/A'}</div>
                  <div><strong>Disease/Issue:</strong> {d.diseaseName || 'N/A'}</div>
                <div>
                  <strong>Care Suggestions:</strong>
                  {(() => {
                      const suggestionsValue = d.careSuggestions;
                    if (suggestionsValue && suggestionsValue !== "N/A") {
                      const itemsArray = Array.isArray(suggestionsValue)
                        ? suggestionsValue
                        : (typeof suggestionsValue === 'string' ? suggestionsValue.split('\n') : []);
                      const processedItems = itemsArray
                        .map(item => String(item).trim().replace(/^- /, '')) 
                        .filter(item => item); 
                      if (processedItems.length > 0) {
                        return (
                          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                            {processedItems.map((item, index) => (
                                <li key={`sugg-hist-modal-${index}`}>{item}</li>
                            ))}
                          </ul>
                        );
                      }
                    }
                    return <span className="ml-1">N/A</span>;
                  })()}
                </div>
                  <div><strong>Confidence Level:</strong> {d.confidenceLevel || 'N/A'}</div>
                  {d.error && <Alert type="error" message={`AI Response Error: ${d.error}`} />}
                  <div className="text-xs text-gray-500 mt-2">
                  <strong>Original Prompt:</strong> {selectedScan.originalPrompt}
                  </div>
              </div>
            </div>
          </div>
        </Modal>
        );
      })()}

      {showClearConfirm && (
        <Modal isOpen={showClearConfirm} onClose={cancelClearAll} title="Clear All History?">
          <div className="p-4">
            <p>Are you sure you want to clear all scan history? This cannot be undone.</p>
            <div className="flex gap-4 mt-4">
              <button onClick={confirmClearAll} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Yes, Clear All</button>
              <button onClick={cancelClearAll} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors">Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ScanHistoryPage;
