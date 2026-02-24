import { Link, useLocation } from "wouter";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import headerImage from "@assets/Group_4_1770360108081.png";
import leftSwirl from "@assets/a_1_1770623817497.png";
import rightSwirl from "@assets/Vector_3_1770623837112.png";

const QUOTES = [
  { text: "I don't need your drugs, I'd rather get high fashion.", author: "Addison" },
  { text: "The world is my oyster, baby come touch the pearl.", author: "Addison" },
  { text: "I'm not hiding, anymore, I won't hide.", author: "Addison" },
  { text: "Beauty begins the moment you decide to be yourself.", author: "Coco Chanel" },
  { text: "How can you live the high life if you do not wear the high heels?", author: "Sonia Rykiel" },
  { text: "People will stare. Make it worth their while.", author: "Harry Winston" },
  { text: "Haters are a good thing because they don't hate the good ones, only the great ones.", author: "Addison Rae" }
];

export default function Home() {
  const [quote, setQuote] = useState(QUOTES[0]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-x-hidden animate-subtle-breath">
      <div className="fixed inset-0 pointer-events-none z-0">
        <img src={leftSwirl} alt="" className="absolute left-[0px] top-1/2 -translate-y-1/2 w-24 md:w-32 opacity-20 animate-[pulse-opacity_4s_ease-in-out_infinite]" />
        <img src={rightSwirl} alt="" className="absolute right-[0px] top-1/2 -translate-y-1/2 w-24 md:w-32 opacity-20 animate-[pulse-opacity_4s_ease-in-out_infinite_2s]" />
      </div>

      <header className="w-full flex justify-center py-8 px-4 bg-background/50 backdrop-blur-sm sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-5xl w-full flex items-center justify-between gap-4 md:gap-8">
          <nav className="flex-1 flex justify-center text-xs md:text-sm tracking-[0.2em] uppercase font-serif">
            <Link href="/about" className="hover:text-primary transition-all duration-300 hover:tracking-[0.3em]">About</Link>
          </nav>
          <div className="flex-shrink-0 px-4 md:px-8">
            <img src={headerImage} alt="Addisonology" className="h-16 md:h-24 object-contain filter drop-shadow-[0_0_15px_rgba(253,199,255,0.3)] hover:drop-shadow-[0_0_40px_rgba(253,199,255,0.9)] brightness-100 hover:brightness-125 hover:scale-105 transition-all duration-500 cursor-pointer" />
          </div>
          <nav className="flex-1 flex-row flex justify-center text-xs md:text-sm tracking-[0.2em] uppercase font-serif">
            <a href="https://discord.gg/u5JHvDZSJp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-all duration-300 hover:tracking-[0.3em] pr-4">
              Discord <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </nav>
        </div>
      </header>

      <main className="w-full max-w-4xl px-6 py-12 flex-1 flex flex-col items-center text-center space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
            <div onClick={() => setLocation('/create-postcard?template=1')} className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-white/5 border border-white/10 transition-all duration-500 hover:border-primary/50 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 text-left">
                <span className="text-[10px] tracking-[0.3em] text-primary uppercase mb-2 block font-medium">Template 01</span>
                <h3 className="text-2xl font-serif text-white leading-tight">Aquamarine</h3>
                <div className="w-0 group-hover:w-full h-px bg-primary/50 mt-4 transition-all duration-700" />
              </div>
            </div>

            <div onClick={() => setLocation('/create-sticker')} className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-white/5 border border-white/10 transition-all duration-500 hover:border-primary/50 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 text-left">
                <span className="text-[10px] tracking-[0.3em] text-primary uppercase mb-2 block font-medium">Template 02</span>
                <h3 className="text-2xl font-serif text-white leading-tight">High Fashion</h3>
                <div className="w-0 group-hover:w-full h-px bg-primary/50 mt-4 transition-all duration-700" />
              </div>
            </div>
        </div>

        <section className="py-8 border-y border-white/5 w-full max-w-2xl">
          <blockquote className="font-serif text-xl md:text-2xl italic text-white/80 leading-relaxed">"{quote.text}"</blockquote>
          <cite className="block mt-4 text-[10px] text-muted-foreground not-italic tracking-[0.2em] uppercase">— {quote.author}</cite>
        </section>
      </main>

      <footer className="w-full py-8 flex flex-col items-center gap-4 border-t border-white/5 relative z-10">
        <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">© {new Date().getFullYear()} Addisonology. All Rights Reserved.</div>
        <p className="font-serif text-[11px] text-white/40 italic px-6">This site is purely fan-made and is not affiliated with Addison or her team.</p>
      </footer>
    </div>
  );
}
