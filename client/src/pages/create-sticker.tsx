import { Link, useLocation } from "wouter";
import { ExternalLink, ArrowLeft, Download } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import headerImage from "@assets/Group_4_1770360108081.png";
import leftSwirl from "@assets/a_1_1770623817497.png";
import rightSwirl from "@assets/Vector_3_1770623837112.png";
import hf1 from "@assets/106_1771242779928.png";
import hf2 from "@assets/107_1771242779974.png";
import hf3 from "@assets/108_1771242779975.png";
import "@fontsource/archivo-black";

export default function CreateSticker() {
  const [, setLocation] = useLocation();
  const [templateId, setTemplateId] = useState('hf1');

  const templates = [
    { id: 'hf1', front: hf1, name: 'HF Heart 1' },
    { id: 'hf2', front: hf2, name: 'HF Heart 2' },
    { id: 'hf3', front: hf3, name: 'HF Heart 3' }
  ];

  const currentTemplate = templates.find(t => t.id === templateId) || templates[0];

  const [hfTopText, setHfTopText] = useState("i don't want cheap love");
  const [hfBottomText, setHfBottomText] = useState("like home");

  useEffect(() => {
    if (templateId === 'hf1') {
      setHfTopText("i don't want cheap love");
    } else if (templateId === 'hf2') {
      setHfTopText("spiraling into you");
    } else if (templateId === 'hf3') {
      setHfTopText("there's no place");
      setHfBottomText("like home");
    }
  }, [templateId]);

  // Drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(2);
  const [brushColor, setBrushColor] = useState('#ffffff');
  const [history, setHistory] = useState<string[]>([]);

  const colors = [
    { name: 'White', value: '#ffffff' },
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
  }, [templateId, brushColor, brushSize]);

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

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleSave = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load template image
    const templateImg = new Image();
    templateImg.crossOrigin = "anonymous";
    templateImg.src = currentTemplate.front;
    templateImg.onload = () => {
      // Draw template
      ctx.drawImage(templateImg, 0, 0, 800, 800);

      // Draw text
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      
      if (templateId === 'hf1' || templateId === 'hf2') {
        ctx.font = "80px 'Arial Narrow', sans-serif";
        ctx.setTransform(0.6, 0, 0, 1.1, 400, 250);
        ctx.fillText(hfTopText, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      } else if (templateId === 'hf3') {
        ctx.font = "52px 'Archivo Black', sans-serif";
        ctx.fillText(hfTopText, 400, 260);
        ctx.fillText(hfBottomText, 400, 535);
      }

      // Draw user drawing
      if (canvasRef.current) {
        ctx.drawImage(canvasRef.current, 0, 0);
      }

      // Download
      const link = document.createElement('a');
      link.download = `sticker-${templateId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
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
          <div className="relative w-full max-w-[600px] aspect-square bg-transparent group cursor-default border border-transparent">
            <div className="relative w-full h-full flex items-center justify-center">
              <img src={currentTemplate.front} alt="Sticker Front" className="w-auto h-full max-h-full max-w-full" />
              
              {(templateId === 'hf1' || templateId === 'hf2') && (
                <div 
                  className="absolute left-[0%] right-[0%] top-[31.25%] -translate-y-1/2 text-white tracking-[-0.02em] text-7xl pointer-events-none text-center scale-x-[0.6] scale-y-[1.1] w-full"
                  style={{ fontFamily: "'Arial Narrow', sans-serif" }}
                >
                  {hfTopText}
                </div>
              )}

              {templateId === 'hf3' && (
                <>
                  <div 
                    className="absolute left-[10%] right-[10%] top-[32.5%] -translate-y-1/2 text-white tracking-[0.02em] text-[1.85rem] pointer-events-none text-center"
                    style={{ fontFamily: "'Archivo Black', sans-serif" }}
                  >
                    {hfTopText}
                  </div>
                  <div 
                    className="absolute left-[10%] right-[10%] top-[66.875%] -translate-y-1/2 text-white tracking-[0.02em] text-[1.85rem] pointer-events-none text-center"
                    style={{ fontFamily: "'Archivo Black', sans-serif" }}
                  >
                    {hfBottomText}
                  </div>
                </>
              )}

              <canvas 
                ref={canvasRef}
                width={800}
                height={800}
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
            <h2 className="text-2xl font-serif text-primary italic">Sticker Creator</h2>
            
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Select Sticker</label>
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
              <input 
                type="range" min="1" max="20" 
                value={brushSize} 
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
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
              <button onClick={() => { clearCanvas(); setHistory([]); }} className="py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] uppercase tracking-widest transition-all">Clear</button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Top Text</label>
                <input value={hfTopText} onChange={(e) => setHfTopText(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-sm focus:border-primary/50 outline-none" />
              </div>
              {templateId === 'hf3' && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Bottom Text</label>
                  <input value={hfBottomText} onChange={(e) => setHfBottomText(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded px-4 py-2 text-sm focus:border-primary/50 outline-none" />
                </div>
              )}
            </div>

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
