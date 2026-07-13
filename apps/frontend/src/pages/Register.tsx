import React from "react";
import { Link } from "react-router-dom";

export const Register: React.FC = () => {
  return (
    <>

{/* Ambient Background Effect */}
<div className="fixed inset-0 pointer-events-none z-0">

<div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
</div>
{/* Main Content Canvas */}
<main className="flex-1 flex items-center justify-center p-6 z-10">
{/* Registration Card */}
<div className="w-full max-w-md glass-panel p-8 rounded-lg shadow-2xl relative overflow-hidden">
{/* Card Header */}
<div className="mb-8 space-y-2">
<div className="flex items-center gap-2 mb-6">
<span className="font-display-ticker text-display-ticker text-secondary tracking-tighter">TERMINAL.OS</span>
<span className="px-2 py-0.5 bg-surface-variant text-on-surface-variant font-label-caps text-label-caps rounded">INSTITUTIONAL</span>
</div>
<h1 className="font-headline-sm text-headline-sm text-on-surface">Create Account</h1>
<p className="font-body-md text-on-surface-variant opacity-80">Establish a direct market access node.</p>
</div>
{/* Form */}
<form className="space-y-6" id="registration-form" onSubmit="handleRegister(event)">
{/* Full Name */}
<div className="space-y-1 group">
<label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Full Name</label>
<div className="relative">
<input className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-data-mono-md text-data-mono-md placeholder:opacity-20 text-on-surface transition-all" placeholder="ALEXANDER VOGEL" required="" type="text"/>
<span className="absolute right-0 bottom-2 material-symbols-outlined text-outline-variant opacity-0 group-focus-within:opacity-100 transition-opacity">person</span>
</div>
</div>
{/* Email */}
<div className="space-y-1 group">
<label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Institutional Email</label>
<div className="relative">
<input className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-data-mono-md text-data-mono-md placeholder:opacity-20 text-on-surface transition-all" id="email-field" placeholder="vogel.a@quant-capital.de" required="" type="email"/>
<span className="absolute right-0 bottom-2 material-symbols-outlined text-secondary opacity-0 transition-opacity" id="email-status">check_circle</span>
</div>
<div className="hidden text-error font-data-mono-sm text-data-mono-sm pt-1" id="email-error">Invalid domain for institutional access.</div>
</div>
{/* Password Row */}
<div className="grid grid-cols-2 gap-6">
<div className="space-y-1 group">
<label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Access Key</label>
<input className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-data-mono-md text-data-mono-md text-on-surface transition-all" required="" type="password"/>
</div>
<div className="space-y-1 group">
<label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Confirm Key</label>
<input className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-data-mono-md text-data-mono-md text-on-surface transition-all" required="" type="password"/>
</div>
</div>
{/* Terms & Conditions */}
<div className="flex items-start gap-3 py-2">
<div className="mt-1">
<input className="rounded-sm bg-surface-variant border-outline-variant text-secondary focus:ring-0 w-4 h-4" required="" type="checkbox"/>
</div>
<p className="font-body-md text-on-surface-variant text-[12px] leading-tight">
                        I acknowledge the <span className="text-secondary cursor-pointer hover:underline">Risk Disclosure Statement</span> and agree to the institutional terms of service.
                    </p>
</div>
{/* Action Button */}
<button className="w-full bg-secondary text-on-secondary font-headline-sm text-headline-sm py-4 rounded shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 overflow-hidden relative" id="submit-btn" type="submit">
<span id="btn-text">INITIALIZE ACCESS</span>
<div className="hidden" id="loading-spinner">
<svg className="animate-spin h-5 w-5 text-on-secondary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
<path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
</svg>
</div>
</button>
</form>
{/* Footer Links */}
<div className="mt-8 text-center">
<p className="font-body-md text-on-surface-variant">
                    Already authenticated? 
                    <a className="text-secondary font-bold hover:underline ml-1" href="#">LOG IN TO TERMINAL</a>
</p>
</div>
{/* Bottom status bar decoration */}
<div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-variant">
<div className="h-full bg-secondary w-0 transition-all duration-300" id="progress-bar"></div>
</div>
</div>
{/* Decorative Floating Data Tags */}
<div className="fixed top-12 left-12 space-y-4 hidden lg:block">
<div className="glass-panel px-3 py-2 border-l-2 border-secondary">
<p className="font-label-caps text-label-caps text-on-surface-variant">NODE_STATUS</p>
<p className="font-data-mono-md text-data-mono-md text-secondary">AWAITING_ENROLLMENT</p>
</div>
<div className="glass-panel px-3 py-2 border-l-2 border-outline">
<p className="font-label-caps text-label-caps text-on-surface-variant">ENCRYPTION</p>
<p className="font-data-mono-md text-data-mono-md">AES_256_GCM</p>
</div>
</div>
<div className="fixed bottom-12 right-12 space-y-4 text-right hidden lg:block">
<div className="glass-panel px-3 py-2 border-r-2 border-secondary">
<p className="font-label-caps text-label-caps text-on-surface-variant">LATENCY_OPTIMIZED</p>
<p className="font-data-mono-md text-data-mono-md text-secondary">&lt; 1.2ms PROVISIONING</p>
</div>
</div>
</main>
{/* UI Logic Script */}


    </>
  );
};
