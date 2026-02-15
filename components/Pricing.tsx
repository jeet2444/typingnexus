import React, { useState, useEffect } from 'react';
import { Check, ArrowUpRight, X, Zap, Tag } from 'lucide-react';
import { getAdminStore, PricingPackage } from '../utils/adminStore';

const Pricing: React.FC = () => {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const store = getAdminStore();
    // Packages should now always be populated due to INITIAL_PACKAGES
    if (store.packages) {
      setPackages(store.packages);
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="p-20 text-center text-white">Loading plans...</div>;

  return (
    <div className="min-h-screen py-20 px-4 bg-gray-950 text-gray-200 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="fixed inset-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 p-32 bg-blue-600/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 p-32 bg-brand-purple/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="text-center mb-16">
          <span className="text-brand-purple font-bold text-sm uppercase tracking-wider mb-2 block">TypingNexus.in Plans</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Simple, Affordable <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-pink-500">Pricing</span></h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-6">Choose the plan that fits your exam schedule. Unlimited access to all practice modules.</p>

          {/* Coupon Ticker */}
          {getAdminStore().coupons?.some(c => c.isActive) && (
            <div className="inline-block bg-green-900/30 border border-green-500/30 rounded-full px-6 py-2 animate-bounce cursor-pointer hover:bg-green-900/50 transition-colors">
              <span className="text-sm text-green-400 font-medium flex items-center gap-2">
                <Tag size={14} />
                Special Offer: Use code <span className="font-bold text-green-300 border-b-2 border-green-500">{getAdminStore().coupons.find(c => c.isActive)?.code}</span>
                for {getAdminStore().coupons.find(c => c.isActive)?.discountValue}% OFF!
              </span>
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="flex flex-wrap justify-center gap-6 items-stretch">
          {packages.map((plan, idx) => (
            <div key={plan.id} className={`relative bg-gray-900/60 backdrop-blur-md border ${plan.highlight || plan.isCombo ? 'border-brand-purple border-2 shadow-lg shadow-purple-900/20 scale-105 z-10' : 'border-gray-800 hover:border-gray-600'} rounded-2xl p-6 transition-all duration-300 flex flex-col w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)] min-w-[280px] group`}>

              {(plan.badge || plan.isCombo) && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wide shadow-lg ${plan.isCombo ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-brand-purple'}`}>
                  {plan.badge || (plan.isCombo ? 'Best Value Combo' : 'Popular')}
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-8 pt-4">
                <h3 className="font-bold text-lg mb-1 text-white group-hover:text-brand-purple transition-colors">{plan.name}</h3>
                <p className="text-gray-500 text-xs mb-4 uppercase tracking-widest font-bold">{plan.subtitle || 'Comprehensive Practice'}</p>

                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-xl font-bold text-gray-400">{plan.currency || '₹'}</span>
                  <span className="text-4xl font-display font-bold text-white">{plan.price}</span>
                  <span className="text-gray-500 text-xs font-medium">{plan.period}</span>
                </div>

                {/* Savings Tags - Logic can be improved or made dynamic */}
                {plan.durationDays >= 365 && <div className="mt-3 text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 inline-block rounded border border-green-500/30">SAVE 80%</div>}
              </div>

              {/* Button */}
              <button className={`w-full py-3 rounded-xl font-bold text-sm mb-8 flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg ${plan.highlight || plan.isCombo ? 'bg-brand-purple text-white hover:bg-purple-600 shadow-purple-900/50' : 'bg-gray-800 text-white hover:bg-gray-700 hover:text-brand-purple border border-gray-700 hover:border-brand-purple'}`}>
                {plan.buttonText || 'Get Started Now'} <ArrowUpRight size={16} />
              </button>

              {/* Features */}
              <ul className="space-y-3 text-xs font-medium text-gray-400 flex-grow">
                {plan.features.map((feat: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="min-w-[16px] mt-0.5">
                      <div className="w-4 h-4 rounded-full bg-green-500/10 border border-green-500/50 flex items-center justify-center">
                        <Check size={10} className="text-green-400" />
                      </div>
                    </div>
                    <span className="leading-snug">{feat}</span>
                  </li>
                ))}
              </ul>

            </div>
          ))}
        </div>

        {/* Bulk Discounts Section */}
        {getAdminStore().settings?.bulkDiscounts && getAdminStore().settings.bulkDiscounts!.length > 0 && (
          <div className="mt-16 max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 bg-brand-purple/5 blur-[50px] rounded-full"></div>

            <h3 className="text-2xl font-bold text-white mb-2 font-display">Need Licenses for your Institute?</h3>
            <p className="text-gray-400 mb-8">Save more when you buy in bulk. Perfect for coaching centers and schools.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {getAdminStore().settings.bulkDiscounts!
                .sort((a, b) => a.minQty - b.minQty)
                .map((rule, idx) => (
                  <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-col items-center hover:border-brand-purple transition-colors">
                    <span className="text-2xl font-bold text-brand-purple">{rule.discount}% OFF</span>
                    <span className="text-xs text-gray-400 uppercase tracking-wide mt-1">On {rule.minQty}+ Qty</span>
                  </div>
                ))}
            </div>

            <div className="mt-8">
              <button className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-brand-purple hover:text-white transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        )}

        <div className="text-center mt-12 space-y-2">
          <p className="text-xs text-gray-500">Prices exclude applicable taxes. Cancel anytime.</p>
          <p className="text-xs text-gray-500">
            Need help choosing? WhatsApp us or email <a href="mailto:contact@typingnexus.in" className="text-brand-purple hover:underline">Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;