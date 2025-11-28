
import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Plus, Trash2, Globe, Twitter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getConfig, saveConfig, resetConfig, AppConfig } from '../services/configService';
import { Source, ScraperConfig } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void; 
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const { t } = useLanguage();
  const [config, setConfig] = useState<AppConfig>(getConfig());
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [keywordsJson, setKeywordsJson] = useState('');
  const [newRssInput, setNewRssInput] = useState('');
  
  // Scraper State
  const [newScraper, setNewScraper] = useState<Partial<ScraperConfig>>({
    id: '', name: '', url: '', containerSelector: '', titleSelector: 'h2', linkSelector: 'a'
  });

  useEffect(() => {
    if (isOpen) {
      const currentConfig = getConfig();
      setConfig(currentConfig);
      setKeywordsJson(JSON.stringify(currentConfig.keywords, null, 2));
    }
  }, [isOpen]);

  const handleToggleSource = (source: string) => {
    setConfig(prev => ({
      ...prev,
      enabledSources: {
        ...prev.enabledSources,
        [source]: !prev.enabledSources[source as Source]
      }
    }));
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setKeywordsJson(e.target.value);
    try {
      JSON.parse(e.target.value);
      setJsonError(null);
    } catch (err) {
      setJsonError("Invalid JSON format");
    }
  };

  // --- RSS / Twitter Logic ---
  const handleAddRss = () => {
    let input = newRssInput.trim();
    if (!input) return;

    // Twitter User detection (simple alphanumeric)
    if (!input.includes('.') && !input.includes('/') && /^[a-zA-Z0-9_]+$/.test(input)) {
      // It's likely a twitter username
      // Use privacydev.net as it is currently more reliable than nitter.net
      input = `https://nitter.privacydev.net/${input}/rss`;
    } else if (!input.startsWith('http')) {
       input = 'https://' + input;
    }

    setConfig(prev => ({
      ...prev,
      rssFeeds: [...(prev.rssFeeds || []), input]
    }));
    setNewRssInput('');
  };

  const handleRemoveRss = (index: number) => {
    setConfig(prev => ({
      ...prev,
      rssFeeds: prev.rssFeeds.filter((_, i) => i !== index)
    }));
  };

  // --- HTML Scraper Logic ---
  const handleAddScraper = () => {
    if (!newScraper.name || !newScraper.url || !newScraper.containerSelector) return;
    
    const scraper: ScraperConfig = {
      id: newScraper.name.toLowerCase().replace(/\s+/g, '-'),
      name: newScraper.name,
      url: newScraper.url,
      containerSelector: newScraper.containerSelector,
      titleSelector: newScraper.titleSelector || 'h2',
      linkSelector: newScraper.linkSelector || 'a',
      summarySelector: newScraper.summarySelector
    };

    setConfig(prev => ({
      ...prev,
      htmlScrapers: [...(prev.htmlScrapers || []), scraper]
    }));
    setNewScraper({ id: '', name: '', url: '', containerSelector: '', titleSelector: 'h2', linkSelector: 'a' });
  };

  const handleRemoveScraper = (index: number) => {
    setConfig(prev => ({
      ...prev,
      htmlScrapers: (prev.htmlScrapers || []).filter((_, i) => i !== index)
    }));
  };


  const handleSave = () => {
    try {
      const parsedKeywords = JSON.parse(keywordsJson);
      const newConfig = { ...config, keywords: parsedKeywords };
      saveConfig(newConfig);
      onSave();
      onClose();
    } catch (e) {
      setJsonError("Cannot save: Invalid JSON");
    }
  };

  const handleReset = () => {
    if (confirm("Reset all settings to default?")) {
      const defaults = resetConfig();
      setConfig(defaults);
      setKeywordsJson(JSON.stringify(defaults.keywords, null, 2));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{t('settingsTitle')}</h2>
            <p className="text-sm text-slate-500">{t('settingsDesc')}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          
          {/* 1. Sources Toggles */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">{t('sourcesTitle')}</h3>
            <div className="flex flex-wrap gap-3">
              {Object.keys(config.enabledSources).map((source) => (
                <label key={source} className="flex items-center space-x-2 px-3 py-2 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer text-sm transition-colors select-none">
                  <input
                    type="checkbox"
                    checked={config.enabledSources[source as Source]}
                    onChange={() => handleToggleSource(source)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-slate-700 font-medium">{source}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 2. RSS / Twitter */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">{t('rssTitle')}</h3>
              <p className="text-xs text-slate-500 mb-3">{t('rssDesc')}</p>
              
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  value={newRssInput}
                  onChange={(e) => setNewRssInput(e.target.value)}
                  placeholder={t('rssPlaceholder')}
                  className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
                <button 
                  onClick={handleAddRss}
                  className="bg-slate-800 text-white px-3 py-2 rounded-md hover:bg-slate-900 flex items-center gap-1 text-sm font-medium"
                >
                  <Plus size={16} /> {t('addRss')}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mb-3">
                {t('nitterTip')}
              </p>

              <div className="bg-slate-50 rounded-md border border-slate-200 divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {config.rssFeeds && config.rssFeeds.map((url, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 text-sm group">
                    <div className="flex items-center gap-2 overflow-hidden">
                       {url.includes('nitter') ? <Twitter size={14} className="text-blue-400 shrink-0" /> : <Globe size={14} className="text-slate-400 shrink-0" />}
                       <span className="text-slate-600 truncate" title={url}>{url}</span>
                    </div>
                    <button onClick={() => handleRemoveRss(idx)} className="text-slate-300 group-hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. HTML Scrapers */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">{t('htmlTitle')}</h3>
              <p className="text-xs text-slate-500 mb-3">{t('htmlDesc')}</p>

               <div className="space-y-2 mb-3 p-3 bg-slate-50 rounded border border-slate-200">
                  <input 
                    placeholder="Name (e.g. QbitAI)"
                    className="w-full text-xs p-2 border rounded"
                    value={newScraper.name}
                    onChange={e => setNewScraper({...newScraper, name: e.target.value})}
                  />
                  <input 
                    placeholder="URL (e.g. https://site.com)"
                    className="w-full text-xs p-2 border rounded"
                    value={newScraper.url}
                    onChange={e => setNewScraper({...newScraper, url: e.target.value})}
                  />
                  <div className="flex gap-2">
                    <input 
                      placeholder="Container CSS (e.g. .post)"
                      className="w-full text-xs p-2 border rounded"
                      value={newScraper.containerSelector}
                      onChange={e => setNewScraper({...newScraper, containerSelector: e.target.value})}
                    />
                     <button 
                      onClick={handleAddScraper}
                      className="bg-blue-600 text-white px-3 rounded text-xs"
                    >
                      Add
                    </button>
                  </div>
               </div>

               <div className="bg-white rounded-md border border-slate-200 divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {(config.htmlScrapers || []).map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 text-sm group">
                    <span className="text-slate-600 truncate text-xs font-medium">{s.name}</span>
                    <button onClick={() => handleRemoveScraper(idx)} className="text-slate-300 group-hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 4. Keywords */}
          <div>
            <div className="flex justify-between items-center mb-2">
               <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t('keywordsTitle')}</h3>
               <button onClick={handleReset} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                 <RotateCcw size={12} /> {t('resetSettings')}
               </button>
            </div>
            
            <textarea
              value={keywordsJson}
              onChange={handleKeywordsChange}
              className={`w-full h-32 font-mono text-[10px] p-4 bg-slate-50 border rounded-md focus:outline-none focus:ring-2 ${jsonError ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-200'}`}
              spellCheck={false}
            />
            {jsonError && <p className="text-red-500 text-xs mt-1">{jsonError}</p>}
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-lg flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-md transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm">
            <Save size={16} />
            {t('saveSettings')}
          </button>
        </div>
      </div>
    </div>
  );
};
