import { Link, useLocation } from "wouter";
import { ExternalLink, ArrowLeft, Download } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import headerImage from "@assets/Group_4_1770360108081.png";
import leftSwirl from "@assets/a_1_1770623817497.png";
import rightSwirl from "@assets/Vector_3_1770623837112.png";
import template1Front from "@assets/art_1771047124929.png";
import template1BackFull from "@assets/86_1770887404803.png";
import template1BackEmpty from "@assets/87_1770887404804.png";
import template3Front from "@assets/87_1770887404804.png";

export default function CreatePostcard() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const [templateId, setTemplateId] = useState(searchParams.get('template') || '1');

  const templates = [
    { id: '1', front: template1Front, back: template1BackEmpty, name: 'Aquamarine', category: 'aquamarine' },
    { id: '2', front: template1BackFull, back: template1BackEmpty, name: 'High Fashion', category: 'aquamarine' },
    { id: '3', front: template3Front, back: template1BackEmpty, name: 'Addisonology', category: 'aquamarine' }
  ];

  const currentTemplate = templates.find(t => t.id === templateId) || templates[0];

  const [greetingsText, setGreetingsText] = useState("Greetings");
  const [fromParisText, setFromParisText] = useState("From Paris");
  const [isFront, setIsFront] = useState(true);

  // Drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(2);
  const [brushColor, setBrushColor] = useState('#3b3933');
  const [history, setHistory] = useState<string[]>([]);

  const colors = [
    { name: 'Aquamarine', value: '#3881d1' },
    { name: 'Dark Gray', value: '#3b3933' }
  ];

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
      }
    }
  }, [isFront, templateId, brushColor, brushSize]);

  const saveToHistory = () => {
    if (canvasRef.current) {
      setHistory(prev => [...prev, canvasRef.current!.toDataURL()]);
    }
  };

  const undo = () => {
    if (history.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop();
    setHistory(newHistory);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (newHistory.length > 0) {
      const img = new Image();
      img.src = newHistory[newHistory.length - 1];
      img.onload = () => ctx.drawImage(img, 0, 0);
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawing) saveToHistory();
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left) * scaleX;
    const y = (('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleSave = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 565;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load template image
    const templateImg = new Image();
    templateImg.crossOrigin = "anonymous";
    templateImg.src = currentTemplate.front;
    templateImg.onload = () => {
      // Draw template
      ctx.drawImage(templateImg, 0, 0, 800, 565);

      if (templateId === '1') {
        ctx.fillStyle = "#3881d1";
        ctx.font = "20px 'Alegreya SC'";
        ctx.textAlign = "center";
        ctx.fillText(greetingsText || "Greetings", 120, 290);
        ctx.fillText(fromParisText || "From Paris", 680, 290);
      }

      // Draw user drawing
      if (canvasRef.current) {
        ctx.drawImage(canvasRef.current, 0, 0);
      }

      // Download
      const link = document.createElement('a');
      link.download = `postcard-${templateId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-x-hidden animate-subtle-breath bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none z-0">
        <img src={leftSwirl} alt="" className="absolute left-[0px] top-1/2 -translate-y-1/2 w-24 md:w-32 opacity-20 animate-[pulse-opacity_4s_ease-in-out_infinite]" />
        <img src={rightSwirl} alt="" className="absolute right-[0px] top-1/2 -translate-y-1/2 w-24 md:w-32 opacity-20 animate-[pulse-opacity_4s_ease-in-out_infinite_2s]" />
      </div>

      <header className="w-full flex justify-center py-8 px-4 bg-background/50 backdrop-blur-sm sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-5xl w-full flex items-center justify-between gap-4 md:gap-8">
          <nav className="flex-1 flex justify-center text-xs md:text-sm tracking-[0.2em] uppercase font-serif">
            <Link href="/" className="flex items-center gap-2 hover:text-primary transition-all duration-300">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
          </nav>
          <div className="flex-shrink-0 px-4 md:px-8">
            <Link href="/">
              <img src={headerImage} alt="Addisonology" className="h-16 md:h-24 object-contain filter drop-shadow-[0_0_15px_rgba(253,199,255,0.3)] hover:drop-shadow-[0_0_40px_rgba(253,199,255,0.9)] brightness-100 hover:brightness-125 hover:scale-105 transition-all duration-500 cursor-pointer" />
            </Link>
          </div>
          <nav className="flex-1 flex justify-center text-xs md:text-sm tracking-[0.2em] uppercase font-serif">
            <a href="https://discord.gg/u5JHvDZSJp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-all duration-300">
              Discord <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </nav>
        </div>
      </header>

      <main className="w-full max-w-6xl px-6 py-12 flex-1 flex flex-col items-center gap-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 w-full items-start justify-center">
          <div className="relative w-full max-w-[800px] aspect-[1.414/1] bg-[#f5f5dc] rounded shadow-2xl overflow-hidden group cursor-default border border-black/5">
            <div className="relative w-full h-full flex items-center justify-center">
              {isFront ? (
                <>
                  <img src={currentTemplate.front} alt="Postcard Front" className="w-full h-full object-cover" />
                  {templateId === '1' && (
                    <>
                      <div className="absolute left-[3%] right-[72%] top-[50.5%] -translate-y-1/2 font-['Alegreya_SC'] text-[#3881d1] tracking-[0.2em] text-lg pointer-events-none text-center">
                        {greetingsText || "Greetings"}
                      </div>
                      <div className="absolute left-[72%] right-[3%] top-[50.5%] -translate-y-1/2 font-['Alegreya_SC'] text-[#3881d1] tracking-[0.2em] text-lg pointer-events-none text-center">
                        {fromParisText || "From Paris"}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <img src={currentTemplate.back} alt="Postcard Back" className="w-full h-full object-cover" />
              )}
              <canvas 
                ref={canvasRef}
                width={800}
                height={565}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
                className="absolute inset-0 w-full h-full cursor-crosshair z-20"
              />
            </div>
          </div>

          <div className="w-full md:w-80 space-y-8 bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-md">
            <h2 className="text-2xl font-serif text-primary italic">Customize</h2>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Select Postcard</label>
              <div className="grid grid-cols-3 gap-2">
                {templates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTemplateId(t.id);
                      clearCanvas();
                    }}
                    className={`aspect-square rounded border transition-all overflow-hidden ${templateId === t.id ? 'border-primary ring-1 ring-primary' : 'border-white/10 opacity-50 hover:opacity-100'}`}
                  >
                    <img src={t.front} alt={t.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Brush Size</label>
              <input type="range" min="1" max="20" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Ink Color</label>
              <div className="flex flex-wrap gap-3">
                {colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setBrushColor(color.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${brushColor === color.value ? 'border-primary scale-110 shadow-lg' : 'border-white/10'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={undo} disabled={history.length === 0} className="py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] uppercase tracking-widest transition-all disabled:opacity-30">Undo</button>
              <button onClick={() => { clearCanvas(); setHistory([]); }} className="py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] uppercase tracking-widest transition-all">Clear All</button>
            </div>

            {isFront && templateId === '1' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Left Text (Max 12)</label>
                  <input maxLength={12} value={greetingsText} onChange={(e) => setGreetingsText(e.target.value)} placeholder="Greetings" className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-sm focus:border-primary/50 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Right Text (Max 12)</label>
                  <input maxLength={12} value={fromParisText} onChange={(e) => setFromParisText(e.target.value)} placeholder="From Paris" className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-sm focus:border-primary/50 outline-none" />
                </div>
              </div>
            )}

            <button onClick={handleSave} className="w-full py-4 bg-primary text-black rounded font-serif text-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group">
              <Download className="w-5 h-5 group-hover:animate-bounce" /> Save Creation
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 flex flex-col items-center gap-4 border-t border-white/5 relative z-10">
        <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">© {new Date().getFullYear()} Addisonology. All Rights Reserved.</div>
        <p className="font-serif text-[11px] text-white/40 italic px-6 text-center">This site is purely fan-made and is not affiliated with Addison or her team.</p>
      </footer>
    </div>
  );
}
