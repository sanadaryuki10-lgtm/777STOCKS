'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import {
  ArrowUpRight,
  TrendingUp,
  ExternalLink,
  Copy,
  Check,
  Flame,
  RotateCw,
  Sparkles,
  ShieldCheck,
  Layers,
  Coins,
  Activity,
  Dices,
} from 'lucide-react';

const CONTRACT_ADDRESS = '0x8c8c2f831ec7792161ac86b9b159d96315a6cdd4';
const PAIR_ADDRESS = '0x70f5baa80f63d18255b6eca7273b69ecf828b6b7';
const DEAD_ADDRESS = '0x000000000000000000000000000000000000dEaD';
const PANCAKESWAP_URL = `https://pancakeswap.finance/swap?chain=bsc&inputCurrency=0xfa6D9B504848606Eb9aeC04CCc161D169B3f2159&outputCurrency=${CONTRACT_ADDRESS}`;
const DEXSCREENER_URL = `https://dexscreener.com/bsc/${CONTRACT_ADDRESS}`;
const BSCSCAN_URL = `https://bscscan.com/token/${CONTRACT_ADDRESS}`;
const BSCSCAN_BURN_URL = `https://bscscan.com/token/${CONTRACT_ADDRESS}?a=${DEAD_ADDRESS}`;
const BREW_URL = `https://brew.family/token/?address=${CONTRACT_ADDRESS}`;
const TWITTER_URL = 'https://x.com/6stockonbrew';

interface MarketData {
  price: string;
  priceNum: number;
  changes: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  mcap: number;
  liq: number;
  vol: number;
  buys: number;
  sells: number;
  lastUpdated: string;
}

const DEFAULT_MARKET: MarketData = {
  price: '0.00007605',
  priceNum: 0.00007605,
  changes: {
    m5: 0.0,
    h1: -5.55,
    h6: 6.92,
    h24: -41.87,
  },
  mcap: 59100,
  liq: 33000,
  vol: 59300,
  buys: 309,
  sells: 234,
  lastUpdated: 'Live from DexScreener',
};

export default function HomePage() {
  const [market, setMarket] = useState<MarketData>(DEFAULT_MARKET);
  const [isLoadingMarket, setIsLoadingMarket] = useState(false);
  const [copied, setCopied] = useState(false);

  // Slot machine interactive simulation state
  const [reel1, setReel1] = useState('7');
  const [reel2, setReel2] = useState('7');
  const [reel3, setReel3] = useState('7');
  const [isSpinning, setIsSpinning] = useState(false);
  const [jackpotMsg, setJackpotMsg] = useState('JACKPOT! 777 Triple Gold!');

  // Burn data
  const totalStartingSupply = 1000000000; // 1 Billion
  const [burnedCount, setBurnedCount] = useState(222546120);
  const remainingSupply = totalStartingSupply - burnedCount;
  const burnedPercent = ((burnedCount / totalStartingSupply) * 100).toFixed(3);

  // Fetch real market data from DexScreener
  const handleManualRefresh = useCallback(async () => {
    setIsLoadingMarket(true);
    try {
      let res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONTRACT_ADDRESS}`, {
        cache: 'no-store',
      });
      let data = res.ok ? await res.json() : null;
      let pair = data?.pairs?.[0] || data?.pair;

      if (!pair) {
        res = await fetch(`https://api.dexscreener.com/latest/dex/pairs/bsc/${PAIR_ADDRESS}`, {
          cache: 'no-store',
        });
        data = res.ok ? await res.json() : null;
        pair = data?.pairs?.[0] || data?.pair;
      }

      if (pair && pair.priceUsd) {
        setMarket({
          price: pair.priceUsd,
          priceNum: parseFloat(pair.priceUsd) || 0.00007605,
          changes: {
            m5: Number(pair.priceChange?.m5 ?? 0),
            h1: Number(pair.priceChange?.h1 ?? -5.55),
            h6: Number(pair.priceChange?.h6 ?? 6.92),
            h24: Number(pair.priceChange?.h24 ?? -41.87),
          },
          mcap: Number(pair.marketCap || pair.fdv || 59100),
          liq: Number(pair.liquidity?.usd || 33000),
          vol: Number(pair.volume?.h24 || 59300),
          buys: Number(pair.txns?.h24?.buys || 309),
          sells: Number(pair.txns?.h24?.sells || 234),
          lastUpdated: `Live from DexScreener · ${new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}`,
        });
      }
    } catch {
      // Fallback stays in place
    } finally {
      setIsLoadingMarket(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function loadMarket() {
      try {
        let res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONTRACT_ADDRESS}`, {
          cache: 'no-store',
        });
        let data = res.ok ? await res.json() : null;
        let pair = data?.pairs?.[0] || data?.pair;

        if (!pair) {
          res = await fetch(`https://api.dexscreener.com/latest/dex/pairs/bsc/${PAIR_ADDRESS}`, {
            cache: 'no-store',
          });
          data = res.ok ? await res.json() : null;
          pair = data?.pairs?.[0] || data?.pair;
        }

        if (!isCancelled && pair && pair.priceUsd) {
          setMarket({
            price: pair.priceUsd,
            priceNum: parseFloat(pair.priceUsd) || 0.00007605,
            changes: {
              m5: Number(pair.priceChange?.m5 ?? 0),
              h1: Number(pair.priceChange?.h1 ?? -5.55),
              h6: Number(pair.priceChange?.h6 ?? 6.92),
              h24: Number(pair.priceChange?.h24 ?? -41.87),
            },
            mcap: Number(pair.marketCap || pair.fdv || 59100),
            liq: Number(pair.liquidity?.usd || 33000),
            vol: Number(pair.volume?.h24 || 59300),
            buys: Number(pair.txns?.h24?.buys || 309),
            sells: Number(pair.txns?.h24?.sells || 234),
            lastUpdated: `Live from DexScreener · ${new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}`,
          });
        }
      } catch {
        // Keep initial market data
      }
    }

    loadMarket();
    const interval = setInterval(loadMarket, 30000);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Copy address handler
  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Interactive 777 Slot Machine Lever Pull
  const spinSlot = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setJackpotMsg('');

    const symbols = ['7', '💎', '📈', '7', '🚀', '🔥', '7', '💰'];
    let counter = 0;
    const spinTimer = setInterval(() => {
      setReel1(symbols[Math.floor(Math.random() * symbols.length)]);
      setReel2(symbols[Math.floor(Math.random() * symbols.length)]);
      setReel3(symbols[Math.floor(Math.random() * symbols.length)]);
      counter++;

      if (counter > 14) {
        clearInterval(spinTimer);
        // Guaranteed jackpot on user interactive roll!
        setReel1('7');
        setReel2('7');
        setReel3('7');
        setIsSpinning(false);
        setJackpotMsg('🔥 JACKPOT! Triple 7s Activated! Hold $777STOCK!');
      }
    }, 100);
  };

  // Generate 1,000 cells for the furnace representation
  const furnaceSquares = useMemo(() => {
    // 1000 squares total. burned is ~222.5M -> 222 squares lit, 1 part
    const litCount = Math.floor(burnedCount / 1000000);
    const fraction = ((burnedCount % 1000000) / 1000000) * 100;
    const squares = [];
    for (let i = 0; i < 1000; i++) {
      if (i < litCount) {
        squares.push({ status: 'lit', frac: 100 });
      } else if (i === litCount) {
        squares.push({ status: 'part', frac: fraction });
      } else {
        squares.push({ status: 'dark', frac: 0 });
      }
    }
    return squares;
  }, [burnedCount]);

  const formatUsd = (val: number) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    if (val >= 1e3) return `$${(val / 1e3).toFixed(1)}K`;
    return `$${val.toLocaleString()}`;
  };

  const formatChange = (val: number) => {
    const prefix = val > 0 ? '+' : val < 0 ? '−' : '';
    return `${prefix}${Math.abs(val).toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#f4eee2] selection:bg-[#dcb15c] selection:text-[#1a1204]">
      {/* Navigation */}
      <nav
        id="navbar"
        className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b border-[#2a2318]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <a
            href="#top"
            id="brand-logo-link"
            className="flex items-center gap-3 group text-decoration-none"
          >
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#dcb15c]/60 shadow-[0_0_12px_rgba(220,177,92,0.25)] flex items-center justify-center bg-[#0d0b08] group-hover:border-[#eec76f] transition-all">
              <Image
                src="/assets/logo-mark.webp"
                alt="777STOCK logo"
                width={40}
                height={40}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-2xl tracking-wider text-[#eec76f] flex items-center gap-1 leading-none">
                777<span className="text-white">STOCK</span>
              </span>
              <span className="text-[10px] tracking-widest text-[#a89c86] uppercase font-mono-num">
                BNB Chain
              </span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
            <a
              href="#about"
              id="nav-link-about"
              className="text-[#a89c86] hover:text-[#f4eee2] transition-colors"
            >
              About
            </a>
            <a
              href="#slot"
              id="nav-link-slot"
              className="text-[#a89c86] hover:text-[#f4eee2] transition-colors flex items-center gap-1.5"
            >
              <Dices className="w-4 h-4 text-[#eec76f]" />
              Lucky 777
            </a>
            <a
              href="#burn"
              id="nav-link-burn"
              className="text-[#a89c86] hover:text-[#f4eee2] transition-colors flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 text-[#ff7a33]" />
              Burn Tracker
            </a>
            <a
              href="#buy"
              id="nav-link-buy"
              className="text-[#a89c86] hover:text-[#f4eee2] transition-colors"
            >
              How to Buy
            </a>
            <a
              href="#links"
              id="nav-link-links"
              className="text-[#a89c86] hover:text-[#f4eee2] transition-colors"
            >
              Links
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={PANCAKESWAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              id="nav-btn-buy"
              className="gold-gradient text-[#1a1204] font-bold text-sm px-5 py-2.5 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(220,177,92,0.3)] flex items-center gap-2"
            >
              <span>Buy $777STOCK</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Ticker Tape */}
      <div
        id="ticker-tape"
        className="w-full bg-[#0c0a07] border-y border-[#2a2318] overflow-hidden py-2.5 select-none"
        aria-hidden="true"
      >
        <div className="animate-marquee gap-8 font-mono-num text-xs font-semibold">
          {[1, 2].map((cycle) => (
            <div key={cycle} className="inline-flex items-center gap-8">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#dcb15c] inline-block animate-ping" />
                <span className="text-[#a89c86]">TOKEN:</span>
                <b className="text-[#f4eee2]">777STOCK</b>
                <span
                  className={
                    market.changes.h24 >= 0 ? 'text-[#3ecf7a]' : 'text-[#ff6b5e]'
                  }
                >
                  ${market.price} (
                  {market.changes.h24 >= 0 ? '▲ +' : '▼ '}
                  {market.changes.h24.toFixed(2)}%)
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#ff7a33]" />
                <span className="text-[#a89c86]">BURNED:</span>
                <span className="text-[#ff7a33]">222.55M ({burnedPercent}%)</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#a89c86]">MCAP:</span>
                <span className="text-[#f4eee2]">{formatUsd(market.mcap)}</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#a89c86]">LIQUIDITY:</span>
                <span className="text-[#f4eee2]">{formatUsd(market.liq)}</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#a89c86]">24H VOL:</span>
                <span className="text-[#f4eee2]">{formatUsd(market.vol)}</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#a89c86]">BUYS:</span>
                <span className="text-[#3ecf7a]">{market.buys}</span>
                <span className="text-[#a89c86]">/ SELLS:</span>
                <span className="text-[#ff6b5e]">{market.sells}</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#a89c86]">PAIR:</span>
                <span className="text-[#eec76f]">777STOCK / BREW</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#a89c86]">DEX:</span>
                <span className="text-[#f4eee2]">PancakeSwap v3</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <main id="top" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        {/* Banner with Exact Uploaded Visual Design */}
        <section id="hero-banner" className="mb-10">
          <div className="relative w-full rounded-2xl overflow-hidden border border-[#dcb15c]/40 shadow-[0_0_35px_rgba(220,177,92,0.2)] bg-[#0c0a07]">
            <div className="relative aspect-[16/6] md:aspect-[16/5] w-full">
              <Image
                src="/assets/banner.webp"
                alt="777STOCK banner with gold slot machine 777 reels and upward trending stock chart"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
              <div className="absolute bottom-4 left-6 md:bottom-6 md:left-8 flex items-center gap-3">
                <div className="bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#dcb15c]/50 text-xs font-mono-num font-semibold text-[#eec76f] flex items-center gap-2 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-[#eec76f]" />
                  <span>The Casino & Stock Super-Memecoin</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Details & Live Quote Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Headlines & Call to Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16120b] border border-[#dcb15c]/30 text-[#eec76f] text-xs font-mono-num font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#eec76f] live-pulse" />
              Freshly Brewed on BNB Chain
            </div>

            <h1 className="font-display font-black text-6xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.88] uppercase text-[#f4eee2]">
              THE ONLY <span className="text-[#eec76f]">STOCK</span> <br />
              WORTH HOLDING. <br />
              <span className="gold-text-gradient">777STOCK</span>
            </h1>

            <p className="text-[#a89c86] text-lg sm:text-xl max-w-2xl leading-relaxed font-normal">
              Born on the <strong className="text-white font-semibold">brew.family</strong> launchpad and
              paired with BREW on PancakeSwap. Pull the golden lever, back the lucky triple sevens, and trade
              the only memecoin that turns market volatility into a jackpot run.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={PANCAKESWAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-cta-buy"
                className="gold-gradient text-[#1a1204] font-extrabold text-base px-8 py-3.5 rounded-full hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(220,177,92,0.35)] flex items-center gap-2.5"
              >
                <span>Buy on PancakeSwap</span>
                <ArrowUpRight className="w-5 h-5" />
              </a>

              <a
                href={DEXSCREENER_URL}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-cta-chart"
                className="bg-[#0e0c08] border border-[#382c1b] hover:border-[#dcb15c] text-[#f4eee2] font-bold text-base px-7 py-3.5 rounded-full hover:bg-[#16120b] transition-all flex items-center gap-2.5"
              >
                <Activity className="w-4 h-4 text-[#eec76f]" />
                <span>View Live Chart</span>
              </a>

              <button
                type="button"
                onClick={handleCopy}
                id="hero-copy-ca"
                className="bg-[#0e0c08] border border-[#382c1b] hover:border-[#dcb15c] text-[#a89c86] hover:text-[#f4eee2] text-sm px-5 py-3.5 rounded-full transition-all flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#3ecf7a]" />
                    <span className="text-[#3ecf7a] font-semibold">CA Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#eec76f]" />
                    <span>Copy Contract</span>
                  </>
                )}
              </button>
            </div>

            {/* Contract Bar */}
            <div className="bg-[#0c0a07] border border-[#2a2318] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-num">
              <div className="flex items-center gap-2 text-[#a89c86]">
                <ShieldCheck className="w-4 h-4 text-[#eec76f]" />
                <span className="uppercase tracking-wider font-semibold">Contract:</span>
                <code className="text-[#f4eee2] select-all break-all">{CONTRACT_ADDRESS}</code>
              </div>
              <button
                onClick={handleCopy}
                className="text-[#eec76f] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Market Quote Box */}
          <div className="lg:col-span-5">
            <aside
              id="market-quote-card"
              className="bg-[#0c0a07] border border-[#2a2318] rounded-2xl p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#eec76f]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between gap-4 border-b border-[#2a2318] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-[#dcb15c]/50 overflow-hidden flex-shrink-0 bg-black">
                    <Image
                      src="/assets/logo-mark.webp"
                      alt="777"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-display font-extrabold text-lg text-[#f4eee2] leading-none">
                      777STOCK / BREW
                    </h2>
                    <span className="text-[11px] font-mono-num text-[#a89c86]">
                      PancakeSwap v3 · BSC
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleManualRefresh}
                  disabled={isLoadingMarket}
                  title="Refresh market data"
                  className="text-[#a89c86] hover:text-[#eec76f] p-1.5 rounded-lg border border-[#2a2318] hover:border-[#dcb15c] transition-colors"
                >
                  <RotateCw
                    className={`w-3.5 h-3.5 ${isLoadingMarket ? 'animate-spin text-[#eec76f]' : ''}`}
                  />
                </button>
              </div>

              {/* Price display */}
              <div className="mt-5">
                <span className="text-xs uppercase font-mono-num tracking-wider text-[#a89c86]">
                  Current Price
                </span>
                <div className="font-mono-num text-3xl sm:text-4xl font-bold text-[#f4eee2] mt-1">
                  ${market.price}
                </div>
              </div>

              {/* Price changes grid */}
              <div className="grid grid-cols-4 gap-2 mt-5">
                {[
                  { label: '5m', val: market.changes.m5 },
                  { label: '1h', val: market.changes.h1 },
                  { label: '6h', val: market.changes.h6 },
                  { label: '24h', val: market.changes.h24 },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-[#120e0a] border border-[#2a2318] rounded-xl p-2.5 text-center font-mono-num"
                  >
                    <span className="text-[10px] uppercase tracking-wider text-[#a89c86] block">
                      {item.label}
                    </span>
                    <b
                      className={`text-xs sm:text-sm font-semibold block mt-0.5 ${
                        item.val >= 0 ? 'text-[#3ecf7a]' : 'text-[#ff6b5e]'
                      }`}
                    >
                      {formatChange(item.val)}
                    </b>
                  </div>
                ))}
              </div>

              {/* Financial metrics */}
              <dl className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-dashed border-[#2a2318] font-mono-num">
                <div>
                  <dt className="text-[11px] text-[#a89c86] uppercase tracking-wider">
                    Market Cap
                  </dt>
                  <dd className="text-base font-bold text-[#f4eee2] mt-0.5">
                    {formatUsd(market.mcap)}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] text-[#a89c86] uppercase tracking-wider">
                    Liquidity
                  </dt>
                  <dd className="text-base font-bold text-[#f4eee2] mt-0.5">
                    {formatUsd(market.liq)}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] text-[#a89c86] uppercase tracking-wider">
                    24h Volume
                  </dt>
                  <dd className="text-base font-bold text-[#f4eee2] mt-0.5">
                    {formatUsd(market.vol)}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] text-[#a89c86] uppercase tracking-wider">
                    24h Trades
                  </dt>
                  <dd className="text-base font-bold mt-0.5">
                    <span className="text-[#3ecf7a]">{market.buys}</span>{' '}
                    <span className="text-[#a89c86]">/</span>{' '}
                    <span className="text-[#ff6b5e]">{market.sells}</span>
                  </dd>
                </div>
              </dl>

              <div className="mt-5 pt-3 border-t border-[#2a2318] flex items-center justify-between text-[11px] font-mono-num text-[#a89c86]">
                <span>{market.lastUpdated}</span>
                <a
                  href={DEXSCREENER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#eec76f] hover:underline flex items-center gap-1"
                >
                  <span>DexScreener</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </aside>
          </div>
        </section>

        {/* Lucky 777 Slot Machine Interactive Section */}
        <section id="slot" className="mb-20 pt-10 border-t border-[#2a2318]">
          <div className="bg-gradient-to-b from-[#140f09] to-[#0a0805] border border-[#dcb15c]/40 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1f160b] border border-[#dcb15c]/40 text-[#eec76f] text-xs font-mono-num font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive 777 Stock Slot Machine</span>
              </div>

              <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-[#f4eee2]">
                PULL THE LEVER. <span className="text-[#eec76f]">HIT 7-7-7.</span>
              </h2>

              <p className="text-[#a89c86] text-sm sm:text-base max-w-xl mx-auto">
                In Wall Street, they pray for quarterly numbers. Here in $777STOCK, every spin is an arrow
                trending green. Give it a pull and claim your lucky multiplier!
              </p>

              {/* Slot reels enclosure */}
              <div className="my-8 flex items-center justify-center gap-4 sm:gap-6">
                <div className="bg-[#050403] border-4 border-[#dcb15c] rounded-2xl p-4 sm:p-6 shadow-[0_0_30px_rgba(220,177,92,0.3)] flex items-center gap-3 sm:gap-5">
                  <div className="w-20 h-28 sm:w-28 sm:h-36 bg-gradient-to-b from-[#18130a] via-[#0d0a06] to-[#18130a] border-2 border-[#b8893d] rounded-xl flex items-center justify-center font-display font-black text-6xl sm:text-7xl text-[#f4eee2] shadow-inner">
                    <span className={reel1 === '7' ? 'text-[#eec76f] scale-110 drop-shadow-[0_0_12px_rgba(238,199,111,0.8)]' : ''}>
                      {reel1}
                    </span>
                  </div>

                  <div className="w-20 h-28 sm:w-28 sm:h-36 bg-gradient-to-b from-[#18130a] via-[#0d0a06] to-[#18130a] border-2 border-[#b8893d] rounded-xl flex items-center justify-center font-display font-black text-6xl sm:text-7xl text-[#f4eee2] shadow-inner">
                    <span className={reel2 === '7' ? 'text-[#eec76f] scale-110 drop-shadow-[0_0_12px_rgba(238,199,111,0.8)]' : ''}>
                      {reel2}
                    </span>
                  </div>

                  <div className="w-20 h-28 sm:w-28 sm:h-36 bg-gradient-to-b from-[#18130a] via-[#0d0a06] to-[#18130a] border-2 border-[#b8893d] rounded-xl flex items-center justify-center font-display font-black text-6xl sm:text-7xl text-[#f4eee2] shadow-inner">
                    <span className={reel3 === '7' ? 'text-[#eec76f] scale-110 drop-shadow-[0_0_12px_rgba(238,199,111,0.8)]' : ''}>
                      {reel3}
                    </span>
                  </div>
                </div>

                {/* Lever Button */}
                <button
                  type="button"
                  onClick={spinSlot}
                  disabled={isSpinning}
                  id="pull-slot-lever"
                  className="group flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-transform"
                >
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full gold-gradient shadow-[0_0_25px_rgba(220,177,92,0.5)] flex items-center justify-center text-[#1a1204] font-black text-xs uppercase tracking-wider group-hover:brightness-125 transition-all ${
                      isSpinning ? 'animate-spin' : ''
                    }`}
                  >
                    {isSpinning ? 'Spin...' : 'SPIN'}
                  </div>
                  <span className="text-[11px] font-mono-num text-[#eec76f] mt-2 font-bold uppercase tracking-wider">
                    Pull Lever
                  </span>
                </button>
              </div>

              {jackpotMsg && (
                <div className="animate-bounce font-mono-num font-bold text-sm sm:text-base text-[#3ecf7a] bg-[#0c1f13] border border-[#3ecf7a]/40 py-2.5 px-6 rounded-full inline-block shadow-lg">
                  {jackpotMsg}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="pt-16 pb-20 border-t border-[#2a2318]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-mono-num uppercase tracking-widest text-[#eec76f] font-semibold">
                The Ticker
              </div>
              <h2 className="font-display font-black text-5xl sm:text-6xl tracking-tight uppercase text-[#f4eee2] leading-[0.92]">
                No earnings calls. <br />
                No dividends. <br />
                <span className="text-[#eec76f]">Just 777STOCK.</span>
              </h2>
              <p className="text-[#a89c86] text-base leading-relaxed pt-2">
                Born on the <strong className="text-[#f4eee2]">brew.family</strong> launchpad and listed
                the same day, 777STOCK trades against BREW on PancakeSwap v3. It&apos;s a community-driven
                culture coin that pairs the unstoppable luck of triple sevens with the raw momentum of the BNB
                Chain ecosystem. The chart is the product, and every holder is in the executive suite.
              </p>
            </div>

            <div className="lg:col-span-6">
              <dl className="bg-[#0c0a07] border border-[#2a2318] rounded-2xl divide-y divide-[#2a2318] overflow-hidden">
                {[
                  { label: 'Ticker', value: '$777STOCK', isGold: true },
                  { label: 'Chain', value: 'BNB Smart Chain (BSC)', isGold: false },
                  {
                    label: 'Launchpad',
                    value: 'brew.family',
                    link: BREW_URL,
                    isGold: false,
                  },
                  { label: 'Pair', value: '777STOCK / BREW', isGold: false },
                  { label: 'DEX', value: 'PancakeSwap v3', isGold: false },
                  { label: 'Total Starting Supply', value: '1,000,000,000', isGold: false },
                  {
                    label: 'Contract Address',
                    value: `${CONTRACT_ADDRESS.slice(0, 6)}...${CONTRACT_ADDRESS.slice(-4)}`,
                    link: BSCSCAN_URL,
                    isGold: true,
                  },
                ].map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-center justify-between px-6 py-4.5 font-mono-num text-sm"
                  >
                    <dt className="text-[#a89c86]">{fact.label}</dt>
                    <dd
                      className={`font-semibold ${
                        fact.isGold ? 'text-[#eec76f]' : 'text-[#f4eee2]'
                      }`}
                    >
                      {fact.link ? (
                        <a
                          href={fact.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1"
                        >
                          <span>{fact.value}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        fact.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Burn Tracker Section */}
        <section id="burn" className="pt-16 pb-20 border-t border-[#2a2318]">
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono-num uppercase tracking-widest text-[#eec76f] font-semibold">
                  Burn Tracker
                </div>
                <h2 className="font-display font-black text-5xl sm:text-6xl uppercase tracking-tight text-[#f4eee2]">
                  Burned For Good
                </h2>
              </div>

              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2a2318] bg-[#0c0a07] text-xs font-mono-num text-[#3ecf7a] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#3ecf7a] live-pulse" />
                <span>LIVE BNB CHAIN FEED</span>
              </div>
            </div>

            <p className="text-[#a89c86] text-base max-w-2xl leading-relaxed">
              Every 777STOCK sent to the dead address is permanently incinerated from the circulating pool —
              unrecoverable, unmintable, forever deflationary.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Burn Stats */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0c0a07] border border-[#2a2318] rounded-2xl p-6">
                <span className="text-xs uppercase font-mono-num text-[#a89c86] tracking-wider block">
                  Total Incinerated
                </span>
                <div className="font-display font-black text-6xl sm:text-7xl text-[#ff7a33] mt-1 leading-none">
                  {burnedCount.toLocaleString()}
                </div>
                <div className="text-sm font-mono-num text-[#a89c86] mt-3">
                  <strong className="text-[#f4eee2] font-semibold">{burnedPercent}%</strong> of the
                  1,000,000,000 initial supply has been permanently burned.
                </div>

                <dl className="mt-6 pt-6 border-t border-[#2a2318] space-y-3 font-mono-num text-xs">
                  <div className="flex justify-between items-center">
                    <dt className="text-[#a89c86] flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#ff7a33]" />
                      <span>Dead Address:</span>
                    </dt>
                    <dd>
                      <a
                        href={BSCSCAN_BURN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#eec76f] hover:underline font-semibold"
                      >
                        0x...dEaD
                      </a>
                    </dd>
                  </div>

                  <div className="flex justify-between items-center">
                    <dt className="text-[#a89c86]">Burn Amount:</dt>
                    <dd className="text-[#f4eee2] font-semibold">222,546,119.74 777STOCK</dd>
                  </div>

                  <div className="flex justify-between items-center">
                    <dt className="text-[#a89c86]">Remaining Supply:</dt>
                    <dd className="text-[#3ecf7a] font-semibold">
                      {remainingSupply.toLocaleString()} 777STOCK
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 pt-4 border-t border-[#2a2318]">
                  <a
                    href={BSCSCAN_BURN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#eec76f] hover:underline text-xs font-mono-num font-bold flex items-center gap-1"
                  >
                    <span>View proof on BscScan</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Furnace Matrix (1,000 Squares) */}
            <div className="lg:col-span-7">
              <div className="bg-[#0c0a07] border border-[#2a2318] rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono-num font-semibold text-[#a89c86] flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#ff7a33]" />
                    <span>The Token Furnace Matrix</span>
                  </span>
                  <span className="text-[11px] font-mono-num text-[#a89c86]">
                    1 square = 1,000,000 tokens
                  </span>
                </div>

                {/* 1,000 Cell Grid: 40 columns x 25 rows */}
                <div
                  className="grid grid-cols-[repeat(40,minmax(0,1fr))] gap-[2px] p-2 bg-[#050403] rounded-lg border border-[#2a2318]"
                  style={{ maxHeight: '320px', overflow: 'hidden' }}
                  aria-label="1000 square furnace grid"
                >
                  {furnaceSquares.map((sq, idx) => {
                    if (sq.status === 'lit') {
                      return (
                        <span
                          key={idx}
                          className="aspect-square rounded-[1px] bg-[#ff7a33] shadow-[0_0_4px_rgba(255,122,51,0.6)]"
                        />
                      );
                    }
                    if (sq.status === 'part') {
                      return (
                        <span
                          key={idx}
                          className="aspect-square rounded-[1px] cell-part bg-gradient-to-t from-[#ff7a33] to-[#1a140d]"
                          style={{
                            background: `linear-gradient(to top, #ff7a33 ${sq.frac}%, #1a140d ${sq.frac}%)`,
                          }}
                        />
                      );
                    }
                    return (
                      <span
                        key={idx}
                        className="aspect-square rounded-[1px] bg-[#1a140d] opacity-80"
                      />
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-4 text-xs font-mono-num text-[#a89c86]">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-[1px] bg-[#ff7a33] inline-block shadow-[0_0_6px_rgba(255,122,51,0.8)]" />
                      <span>Burned ({burnedPercent}%)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-[1px] bg-[#1a140d] inline-block" />
                      <span>In Circulation</span>
                    </span>
                  </div>
                  <span>Total Matrix: 1,000 squares (1B supply)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Buy Section */}
        <section id="buy" className="pt-16 pb-20 border-t border-[#2a2318]">
          <div className="space-y-4 mb-10">
            <div className="text-xs font-mono-num uppercase tracking-widest text-[#eec76f] font-semibold">
              Get In
            </div>
            <h2 className="font-display font-black text-5xl sm:text-6xl uppercase tracking-tight text-[#f4eee2]">
              How to Buy $777STOCK
            </h2>
            <p className="text-[#a89c86] text-base max-w-xl">
              777STOCK is paired with BREW, so you can swap BNB directly through PancakeSwap router or swap
              BREW directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Set up a Wallet',
                desc: 'Install MetaMask, Trust Wallet, or Rabby. Switch your network to BNB Smart Chain (BSC) and hold BNB for gas fees.',
                icon: ShieldCheck,
              },
              {
                step: '02',
                title: 'Get BNB or BREW',
                desc: 'Acquire BNB on any exchange and transfer to your wallet. You can swap BNB for BREW on PancakeSwap or let the router swap directly.',
                icon: Coins,
              },
              {
                step: '03',
                title: 'Swap for $777STOCK',
                desc: 'Paste the official 777STOCK contract address into PancakeSwap, set slippage to 1-3%, and confirm the transaction.',
                icon: Layers,
              },
            ].map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="bg-[#0c0a07] border border-[#2a2318] hover:border-[#dcb15c]/50 transition-all rounded-2xl p-6 relative group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono-num font-bold text-[#eec76f] tracking-widest uppercase">
                      STEP {st.step}
                    </span>
                    <Icon className="w-5 h-5 text-[#a89c86] group-hover:text-[#eec76f] transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-[#f4eee2] mb-2">{st.title}</h3>
                  <p className="text-[#a89c86] text-sm leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Copy Contract Address banner */}
          <div className="mt-8 bg-[#100d09] border border-[#dcb15c]/40 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono-num uppercase tracking-wider text-[#eec76f] font-semibold block">
                Verified Contract Address
              </span>
              <code className="text-sm font-mono-num text-[#f4eee2] select-all font-semibold">
                {CONTRACT_ADDRESS}
              </code>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopy}
                id="buy-copy-btn"
                className="gold-gradient text-[#1a1204] font-bold text-sm px-6 py-2.5 rounded-full hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-md cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Address'}</span>
              </button>

              <a
                href={PANCAKESWAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#2a2318] hover:border-[#dcb15c] text-[#f4eee2] font-semibold text-sm px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5"
              >
                <span>Open PancakeSwap</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Links & Resources Section */}
        <section id="links" className="pt-16 pb-10 border-t border-[#2a2318]">
          <div className="space-y-2 mb-8">
            <div className="text-xs font-mono-num uppercase tracking-widest text-[#eec76f] font-semibold">
              Stay in the Loop
            </div>
            <h2 className="font-display font-black text-5xl sm:text-6xl uppercase tracking-tight text-[#f4eee2]">
              Official Links
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                title: 'DexScreener',
                subtitle: 'Real-time Chart',
                url: DEXSCREENER_URL,
              },
              {
                title: 'PancakeSwap',
                subtitle: 'Swap 777STOCK',
                url: PANCAKESWAP_URL,
              },
              {
                title: 'BscScan',
                subtitle: 'Token Contract',
                url: BSCSCAN_URL,
              },
              {
                title: 'brew.family',
                subtitle: 'Launchpad',
                url: BREW_URL,
              },
              {
                title: 'X / Twitter',
                subtitle: '@6stockonbrew',
                url: TWITTER_URL,
              },
            ].map((link) => (
              <a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0c0a07] border border-[#2a2318] hover:border-[#dcb15c] hover:bg-[#120e0a] rounded-xl p-5 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <b className="text-[#f4eee2] font-bold text-base group-hover:text-[#eec76f] transition-colors">
                      {link.title}
                    </b>
                    <ArrowUpRight className="w-4 h-4 text-[#a89c86] group-hover:text-[#eec76f] transition-colors" />
                  </div>
                  <small className="text-[#a89c86] font-mono-num text-xs block">
                    {link.subtitle}
                  </small>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2a2318] bg-[#070604] py-12 text-[#a89c86] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md overflow-hidden border border-[#dcb15c]/50">
                <Image
                  src="/assets/logo-mark.webp"
                  alt="777"
                  width={28}
                  height={28}
                  className="object-cover"
                />
              </div>
              <span className="font-display font-black text-xl text-[#eec76f] tracking-wider">
                777STOCK
              </span>
            </div>

            <div className="flex items-center gap-6 font-mono-num text-xs">
              <a href="#top" className="hover:text-[#f4eee2] transition-colors">
                Back to top ↑
              </a>
              <a
                href={BSCSCAN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#f4eee2] transition-colors"
              >
                BscScan
              </a>
              <a
                href={DEXSCREENER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#f4eee2] transition-colors"
              >
                Chart
              </a>
            </div>
          </div>

          <p className="max-w-3xl leading-relaxed text-[#7e735e]">
            <strong>$777STOCK</strong> is a decentralized community memecoin launched on BNB Smart Chain.
            It is created for entertainment and community engagement purposes with no guarantees of profit or
            financial returns. Cryptocurrency trading involves substantial risk; trade responsibly and always
            verify the official contract address: <code className="text-[#a89c86]">{CONTRACT_ADDRESS}</code>.
          </p>

          <div className="pt-4 border-t border-[#1a140d] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-num text-[#5a5243]">
            <span>© 2026 777STOCK · Powered by BNB Chain & brew.family</span>
            <span>All 7s aligned. Hold the lucky stock.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
