import React, { useState } from 'react';
import { Info, Lock, ChevronDown, Pencil } from 'lucide-react';
import './settings.css';

const Switch = () => {
  const [enabled, setEnabled] = useState(false);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => setEnabled(!enabled)}
      className="switch"
      data-state={enabled ? 'checked' : 'unchecked'}
    >
      <span className="switch-thumb" />
    </button>
  );
};

const Select = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="select-container">
      <button 
        className="select-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value}</span>
        <ChevronDown className="select-icon" />
      </button>
      {isOpen && (
        <div className="select-options">
          {options.map((option) => (
            <button
              key={option.value}
              className="select-option"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const StoreInformationSection = () => (
  <div className="section-card">
    <div className="section-header">
      <h2 className="section-title">
        Store Information
        <div className="info-icon-wrapper">
          <Info className="info-icon" />
        </div>
      </h2>
    </div>
    <div className="store-url-container">
      <div className="input-group">
        <div className="store-url-field">
          <span className="url-prefix">one1link.bio/</span>
          <input
            type="text"
            value=""
            readOnly
            className="url-input"
          />
          <div className="edit-button-container">
            <button className="edit-button">
              <Pencil className="edit-icon" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
    <p className="section-description">
      This is your Store's official link. Share this to your community and on your socials.
    </p>
  </div>
);

const SensitiveContentSection = () => (
  <div className="section-card">
    <div className="section-header">
      <h2 className="section-title">
        Sensitive Content Warning
        <div className="info-icon-wrapper">
          <Info className="info-icon" />
        </div>
      </h2>
    </div>
    <div className="content-row px-6 py-2">
      <span className="content-text">
        Show content warning before your store opens
      </span>
      <Switch />
    </div>
  </div>
);

const AnalyticsSection = () => (
  <div className="analytics-section">
    <div className="section-header">
      <h2 className="section-title">
        Analytics Integration
        <div className="info-icon-wrapper">
          <Info className="info-icon" />
        </div>
      </h2>
    </div>
    
    <div className="tracking-group">
      <h3 className="tracking-title">Facebook Tracking</h3>
      <div className="input-stack">
        <input
          type="text"
          placeholder="Pixel ID"
          className="input-field"
        />
        <input
          type="text"
          placeholder="Pixel Conversions API Access Token"
          className="input-field"
        />
      </div>
    </div>

    <div className="tracking-group">
      <h3 className="tracking-title">Google Tracking</h3>
      <input
        type="text"
        placeholder="Google Analytics ID"
        className="input-field"
      />
    </div>

    <div className="learn-more">
      <span className="learn-more-text">
        Know more about setting up tracking on your store.
        <a href="#" className="learn-more-link">Learn here</a>
      </span>
    </div>
  </div>
);

const ReferralSection = () => {
  const [footerPosition, setFooterPosition] = useState('sticky');
  
  const positionOptions = [
    { value: 'sticky', label: 'Sticks on scroll' },
    { value: 'fixed', label: 'Fixed' },
    { value: 'relative', label: 'Normal' }
  ];

  return (
    <div className="referral-section">
      <div className="footer-controls">
        <div className="control-row">
          <div className="flex items-center">
            <span className="control-label">Hide OneApp Referral Link</span>
            <span className="pro-badge">
              <Lock className="pro-icon" />
              PRO feature
            </span>
          </div>
          <Switch />
        </div>
        
        <div className="control-row">
          <span className="control-label">Footer position</span>
          <Select
            value={footerPosition}
            options={positionOptions}
            onChange={setFooterPosition}
          />
        </div>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  return (
    <div className="settings-page">
      <StoreInformationSection />
      <SensitiveContentSection />
      <AnalyticsSection />
      <ReferralSection />
    </div>
  );
};

export default SettingsPage;