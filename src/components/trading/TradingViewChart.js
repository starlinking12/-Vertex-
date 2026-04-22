import React, { useEffect, useRef } from 'react';

export const TradingViewChart = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        new window.TradingView.widget({
          container_id: containerRef.current.id,
          symbol: 'BINANCE:ETHUSDT',
          interval: '15',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#0b1022',
          enable_publishing: false,
          autosize: true
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <div id="tv-chart-container" ref={containerRef} style={{ height: '450px', width: '100%' }} />
  );
};