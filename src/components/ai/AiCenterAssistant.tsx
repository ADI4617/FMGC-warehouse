import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const AiCenterAssistant: React.FC = () => {
  const {
    currentUser,
    chatMessages,
    sendChatMessage,
    setActiveTab,
    setSelectedCustomerIdForPayment,
    setIsRecordPaymentOpen,
    setIsAiOptimizerOpen,
    addToast
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    setInputQuery('');
    setIsTyping(true);
    await sendChatMessage(text);
    setIsTyping(false);
  };

  const handleActionButtonClick = (actionType: string, payload?: any) => {
    if (actionType === 'navigate_collections') {
      if (payload?.customerId) {
        setSelectedCustomerIdForPayment(payload.customerId);
      }
      setActiveTab('collections');
    } else if (actionType === 'send_reminder') {
      addToast('success', 'Reminder Dispatched', 'Automated payment reminder with invoice statement sent via email/SMS to City Retailers.');
    } else if (actionType === 'navigate_inventory') {
      setActiveTab('inventory');
    } else if (actionType === 'navigate_reports') {
      setActiveTab('reports');
    } else if (actionType === 'trigger_ai_optimizer') {
      setIsAiOptimizerOpen(true);
    }
  };

  const suggestionPrompts = [
    "Which product sold the most this month?",
    "How much money is pending from City Retailers?",
    "What are my top 5 expiry risks?",
    "Which SKUs are below safety threshold?"
  ];

  return (
    <div className="flex-1 flex h-[calc(100vh-64px)] overflow-hidden bg-[#F9F7F2]">
      {/* Left Chat Workspace */}
      <div className="flex-1 flex flex-col h-full bg-[#F9F7F2] relative">
        {/* Chat History Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* Welcome Header */}
          <div className="text-center py-6 border-b border-[#1A1A1A]/10 max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded bg-[#FFFFFF] border border-[#D4AF37]/50 flex items-center justify-center mx-auto mb-3 shadow-2xs">
              <span className="material-symbols-outlined text-[#8C733E] text-[28px]">auto_awesome</span>
            </div>
            <div className="text-[10px] uppercase font-bold tracking-editorial text-[#8C733E] mb-1">
              Executive AI Intelligence Engine
            </div>
            <h2 className="text-[26px] font-serif font-bold text-[#1A1A1A] mb-1">
              Good morning, {currentUser.name.split(' ')[0]}.
            </h2>
            <p className="text-[13.5px] text-[#5C5850] max-w-md mx-auto leading-relaxed">
              I'm your FMCG Distribution Intelligence Assistant. Live inventory, collections, and run-rates are synced.
            </p>

            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-5 max-w-2xl mx-auto">
              {suggestionPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="px-3.5 py-1.5 bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded text-[12px] text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#F4F1EA] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs font-mono-data"
                >
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          {chatMessages.map((msg) => {
            const isAssistant = msg.sender === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
              >
                {isAssistant && (
                  <div className="w-8 h-8 rounded bg-[#1A1A1A] border border-[#D4AF37]/50 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <span className="material-symbols-outlined text-[#D4AF37] text-[16px]">auto_awesome</span>
                  </div>
                )}

                <div
                  className={`rounded px-5 py-4 max-w-[85%] sm:max-w-[75%] ${
                    isAssistant
                      ? 'bg-[#FFFFFF] border border-[#1A1A1A]/12 text-[#1A1A1A] shadow-2xs'
                      : 'bg-[#EEEBE3] text-[#1A1A1A] border border-[#1A1A1A]/15'
                  }`}
                >
                  <p className="text-[13.5px] leading-relaxed mb-3">
                    {msg.text}
                  </p>

                  {/* Structured Data View in AI Bubble */}
                  {msg.structuredData && (
                    <div className="bg-[#F4F1EA] border border-[#1A1A1A]/10 rounded p-3.5 mb-3">
                      <div className="flex justify-between items-center mb-2.5 px-0.5">
                        <span className="text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">
                          {msg.structuredData.title}
                        </span>
                        <span className="material-symbols-outlined text-[16px] text-[#78746D]">bar_chart</span>
                      </div>

                      {/* Items with visual progress bars */}
                      <div className="space-y-2.5">
                        {msg.structuredData.items.map((item, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between items-center text-[12px]">
                              <span className="font-mono-data font-medium text-[#1A1A1A]">{item.label}</span>
                              <span className="font-mono-data font-bold text-[#1A1A1A]">{item.value}</span>
                            </div>
                            {item.percentage !== undefined && (
                              <div className="w-full bg-[#E2DDD2] h-1.5 rounded overflow-hidden">
                                <div
                                  className="h-full rounded transition-all duration-500"
                                  style={{
                                    width: `${item.percentage}%`,
                                    backgroundColor: item.color || '#1A1A1A'
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Structured Action Buttons */}
                  {msg.structuredData?.actionButtons && (
                    <div className="flex flex-wrap gap-2.5 mt-3 pt-2 border-t border-[#1A1A1A]/10">
                      {msg.structuredData.actionButtons.map((btn, bIdx) => (
                        <button
                          key={bIdx}
                          onClick={() => handleActionButtonClick(btn.actionType, btn.payload)}
                          className={`text-[11.5px] uppercase tracking-editorial font-medium px-3.5 py-1.5 rounded flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                            bIdx === 0
                              ? 'bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/40 hover:bg-[#2A2A2A]'
                              : 'bg-[#FFFFFF] border border-[#1A1A1A]/15 text-[#1A1A1A] hover:bg-[#F4F1EA]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[15px]">{btn.icon}</span>
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded bg-[#1A1A1A] border border-[#D4AF37]/50 flex items-center justify-center shrink-0 shadow-2xs">
                <span className="material-symbols-outlined text-[#D4AF37] text-[16px] animate-spin">auto_awesome</span>
              </div>
              <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded px-4 py-3 text-[13px] text-[#78746D] flex items-center gap-2 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#8C733E] animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-[#8C733E] animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 rounded-full bg-[#8C733E] animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                <span className="font-mono-data text-[11.5px] ml-1 uppercase tracking-editorial">Analyzing distributor live datasets...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[#1A1A1A]/10 bg-[#FFFFFF] shrink-0">
          <div className="relative max-w-4xl mx-auto">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Query sales ledger, run-rates, customer overdue balances, or batch FEFO risk..."
              className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded pl-4 pr-12 py-3 text-[13px] text-[#1A1A1A] placeholder-[#78746D] focus:border-[#1A1A1A] focus:bg-[#FFFFFF] transition-all outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim()}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 hover:bg-[#2A2A2A] disabled:opacity-40 transition-all cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">send</span>
            </button>
          </div>

          <div className="text-center mt-2">
            <span className="text-[11px] text-[#78746D] flex items-center justify-center gap-1 font-mono-data">
              <span className="material-symbols-outlined text-[13px]">info</span>
              AI can make mistakes. Verify critical financial data against physical inventory ledgers.
            </span>
          </div>
        </div>
      </div>

      {/* Right Contextual Sidebar: Data Sources Context */}
      <div className="w-80 border-l border-[#1A1A1A]/10 bg-[#F4F1EA] hidden xl:flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-[#1A1A1A]/10 flex items-center gap-2 bg-[#FFFFFF]">
          <span className="material-symbols-outlined text-[#8C733E] text-[18px]">database</span>
          <div>
            <h3 className="text-[14px] font-serif font-bold text-[#1A1A1A]">Data Sources Context</h3>
            <p className="text-[10px] uppercase tracking-editorial text-[#78746D]">Live Verified Connectors</p>
          </div>
        </div>

        <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-3.5">
          <p className="text-[11.5px] text-[#5C5850] leading-normal">
            The AI is currently referencing these live operational datasets:
          </p>

          {/* Source 1: Sales Ledger */}
          <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded p-3.5 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-[#F4F1EA] flex items-center justify-center shrink-0 border border-[#1A1A1A]/10">
                <span className="material-symbols-outlined text-[#1A1A1A] text-[16px]">payments</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[12.5px] font-bold text-[#1A1A1A] font-serif">Sales Ledger</h4>
                <p className="text-[11px] text-[#78746D] mt-0.5 font-mono-data">Aug 1, 2026 - Aug 20, 2026</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#234E3E]"></span>
                  <span className="text-[10.5px] font-medium text-[#234E3E] uppercase tracking-editorial">Live Sync Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Source 2: Customer Profiles */}
          <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded p-3.5 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-[#F4F1EA] flex items-center justify-center shrink-0 border border-[#1A1A1A]/10">
                <span className="material-symbols-outlined text-[#1A1A1A] text-[16px]">group</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[12.5px] font-bold text-[#1A1A1A] font-serif">Customer Ledgers</h4>
                <p className="text-[11px] text-[#78746D] mt-0.5 font-mono-data">5 Active Retail Accounts</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#234E3E]"></span>
                  <span className="text-[10.5px] font-medium text-[#234E3E] uppercase tracking-editorial">Live Sync Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Source 3: Warehouse Batches */}
          <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded p-3.5 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-[#F4F1EA] flex items-center justify-center shrink-0 border border-[#1A1A1A]/10">
                <span className="material-symbols-outlined text-[#1A1A1A] text-[16px]">warehouse</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[12.5px] font-bold text-[#1A1A1A] font-serif">FEFO Batch Ledger</h4>
                <p className="text-[11px] text-[#78746D] mt-0.5 font-mono-data">12 SKUs, 6 Batches Tracked</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#234E3E]"></span>
                  <span className="text-[10.5px] font-medium text-[#234E3E] uppercase tracking-editorial">Live Sync Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
