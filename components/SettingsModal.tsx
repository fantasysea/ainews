
import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getConfig, saveConfig, resetConfig, AppConfig } from '../services/configService';
import { Source } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void; // Trigger a refresh after save
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const { t } = useLanguage();
  const [config, setConfig] = useState<AppConfig>(getConfig());
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [keywordsJson, setKeywordsJson] = useState('');
  const [newRssUrl, setNewRssUrl] = useState('');

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

  const handleAddRss = () => {
    if (!newRssUrl.trim()) return;
    setConfig(prev => ({
      ...prev,
      rssFeeds: [...(prev.rssFeeds || []), newRssUrl.trim()]
    }));
    setNewRssUrl('');
  };

  const handleRemoveRss = (index: number) => {
    setConfig(prev => ({
      ...prev,
      rssFeeds: prev.rssFeeds.filter((_, i) => i !== index)
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
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
          {/* Sources Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">{t('sourcesTitle')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.keys(config.enabledSources).map((source) => (
                <label key={source} className="flex items-center space-x-2 p-2 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={config.enabledSources[source as Source]}
                    onChange={() => handleToggleSource(source)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-slate-700 font-medium truncate">{source}</span>
                </label>
              ))}
            </div>
          </div>

          {/* RSS Feeds Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">{t('rssTitle')}</h3>
            <p className="text-xs text-slate-500 mb-3">{t('rssDesc')}</p>
            
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={newRssUrl}
                onChange={(e) => setNewRssUrl(e.target.value)}
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

            {config.rssFeeds && config.rssFeeds.length > 0 && (
              <div className="bg-slate-50 rounded-md border border-slate-200 divide-y divide-slate-100">
                {config.rssFeeds.map((url, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 text-sm">
                    <span className="text-slate-600 truncate flex-1 pr-4" title={url}>{url}</span>
                    <button onClick={() => handleRemoveRss(idx)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Keywords Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
               <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t('keywordsTitle')}</h3>
               <button onClick={handleReset} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                 <RotateCcw size={12} /> {t('resetSettings')}
               </button>
            </div>
            <p className="text-xs text-slate-500 mb-2">{t('keywordsDesc')}</p>
            
            <textarea
              value={keywordsJson}
              onChange={handleKeywordsChange}
              className={`w-full h-48 font-mono text-xs p-4 bg-slate-50 border rounded-md focus:outline-none focus:ring-2 ${jsonError ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-200'}`}
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
