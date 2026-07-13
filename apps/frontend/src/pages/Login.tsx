import React from "react";
import { Link } from "react-router-dom";

export const Login: React.FC = () => {
  return (
    <>

{/* Background Atmospheric Layer */}
<div className="fixed inset-0 z-0">

<div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"></div>
</div>
{/* Main Content Canvas */}
<main className="relative z-10 flex-grow flex items-center justify-center p-gutter">
{/* Login Card */}
<div className="w-full max-w-[400px] flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700" id="login-container">
{/* Brand Anchor (Identity Alignment) */}
<div className="flex flex-col items-center mb-4">
<span className="font-display-ticker text-display-ticker text-primary tracking-tighter mb-1">TERMINAL.OS</span>
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-[0.2em]">Institutional Access Node</span>
</div>
{/* Credential Card */}
<div className="glass-panel border border-outline-variant shadow-2xl relative overflow-hidden">
{/* Scan line effect */}
<div className="absolute inset-x-0 top-0 scan-line opacity-20 pointer-events-none"></div>
<div className="p-8 flex flex-col gap-6">
{/* Security Indicator */}
<div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-highest border border-outline-variant w-fit">
<span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span>
<span className="font-data-mono-sm text-data-mono-sm text-secondary uppercase">Secure Terminal Session</span>
</div>
<form className="flex flex-col gap-5" id="login-form" onSubmit="handleLogin(event)">
{/* Email Input */}
<div className="flex flex-col gap-1.5 input-glow group">
<label className="font-label-caps text-label-caps text-on-surface-variant px-1">IDENTITY_UID</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">alternate_email</span>
<input className="w-full bg-surface-container-lowest border-b-2 border-outline-variant focus:border-secondary focus:ring-0 text-on-surface font-data-mono-md text-data-mono-md pl-10 pr-4 py-3 transition-all duration-200 placeholder:text-outline-variant/50" placeholder="Enter corporate email" required="" type="email"/>
</div>
</div>
{/* Password Input */}
<div className="flex flex-col gap-1.5 input-glow group">
<label className="font-label-caps text-label-caps text-on-surface-variant px-1">ACCESS_KEY</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">lock</span>
<input className="w-full bg-surface-container-lowest border-b-2 border-outline-variant focus:border-secondary focus:ring-0 text-on-surface font-data-mono-md text-data-mono-md pl-10 pr-4 py-3 transition-all duration-200 placeholder:text-outline-variant/50" placeholder="••••••••••••" required="" type="password"/>
</div>
</div>
{/* Action Row */}
<div className="flex items-center justify-between py-2">
<label className="flex items-center gap-2 cursor-pointer group">
<input className="w-4 h-4 rounded-none bg-surface-container border-outline-variant text-secondary focus:ring-0 focus:ring-offset-0 transition-colors" type="checkbox"/>
<span className="font-label-caps text-label-caps text-on-surface-variant group-hover:text-on-surface transition-colors">REMEMBER_NODE</span>
</label>
<a className="font-label-caps text-label-caps text-primary hover:text-secondary transition-colors underline underline-offset-4 decoration-primary/30" href="#">FORGOT_KEY?</a>
</div>
{/* Submit Button */}
<button className="relative overflow-hidden group w-full bg-secondary text-on-secondary font-headline-sm text-headline-sm py-4 flex items-center justify-center transition-all active:scale-[0.98] hover:bg-secondary-fixed" id="submit-btn" type="submit">
<span className="relative z-10 font-bold tracking-widest uppercase" id="btn-text">ESTABLISH CONNECTION</span>
<div className="hidden relative z-10 flex items-center gap-2" id="btn-loading">
<svg className="animate-spin h-5 w-5 text-on-secondary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
<path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
</svg>
<span className="font-bold tracking-widest uppercase">AUTHENTICATING...</span>
</div>
{/* Subtle button hover glow */}
<div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
</button>
</form>
</div>
{/* Bottom Status Bar (Institutional Detail) */}
<div className="bg-surface-container-high border-t border-outline-variant px-8 py-3 flex justify-between items-center">
<div className="flex items-center gap-2">
<div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></div>
<span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant">CORE_SERVER: NY-DC-1</span>
</div>
<span className="font-data-mono-sm text-data-mono-sm text-outline">ENC: AES-256-GCM</span>
</div>
</div>
{/* Footer Links */}
<div className="flex flex-col items-center gap-4 mt-2">
<p className="font-body-md text-on-surface-variant text-sm">
                    New institution? 
                    <a className="text-primary hover:text-secondary font-semibold underline underline-offset-4 decoration-primary/30 ml-1 transition-colors" href="#">Register Access Point</a>
</p>
<div className="flex gap-4 opacity-50">
<span className="font-label-caps text-label-caps hover:opacity-100 cursor-pointer transition-opacity">COMPLIANCE</span>
<span className="font-label-caps text-label-caps hover:opacity-100 cursor-pointer transition-opacity">SLA_AGREEMENT</span>
<span className="font-label-caps text-label-caps hover:opacity-100 cursor-pointer transition-opacity">SUPPORT_TICKET</span>
</div>
</div>
</div>
</main>
{/* Global Layout Utility: Footer Ticker */}
<footer className="relative z-10 h-8 border-t border-outline-variant bg-surface-container-lowest/80 backdrop-blur-sm flex items-center px-4 overflow-hidden">
<div className="flex gap-8 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
<div className="flex items-center gap-2">
<span className="font-data-mono-sm text-data-mono-sm text-outline">SYSTEM:</span>
<span className="font-data-mono-sm text-data-mono-sm text-secondary">OPERATIONAL</span>
</div>
<div className="flex items-center gap-2">
<span className="font-data-mono-sm text-data-mono-sm text-outline">LATENCY:</span>
<span className="font-data-mono-sm text-data-mono-sm text-primary">1.2ms</span>
</div>
<div className="flex items-center gap-2">
<span className="font-data-mono-sm text-data-mono-sm text-outline">NODES:</span>
<span className="font-data-mono-sm text-data-mono-sm text-on-surface">1,024 ACTIVE</span>
</div>
<div className="flex items-center gap-2">
<span className="font-data-mono-sm text-data-mono-sm text-outline">MARKET_FEED:</span>
<span className="font-data-mono-sm text-data-mono-sm text-secondary">SYNCED</span>
</div>
{/* Duplicate for seamless loop */}
<div className="flex items-center gap-2">
<span className="font-data-mono-sm text-data-mono-sm text-outline">SYSTEM:</span>
<span className="font-data-mono-sm text-data-mono-sm text-secondary">OPERATIONAL</span>
</div>
<div className="flex items-center gap-2">
<span className="font-data-mono-sm text-data-mono-sm text-outline">LATENCY:</span>
<span className="font-data-mono-sm text-data-mono-sm text-primary">1.2ms</span>
</div>
</div>
</footer>
<style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
    ` }} />


    </>
  );
};
