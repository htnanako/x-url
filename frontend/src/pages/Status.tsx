import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Moon, Sun, Github } from "lucide-react";

export default function StatusPage({ code }: { code: 404 | 410 }) {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const shouldDark = saved ? saved === "dark" : true;
    document.documentElement.classList.toggle("dark", shouldDark);
    setIsDark(shouldDark);
  }, []);
  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }
  const title = code === 404 ? "链接不存在 (404)" : "链接已过期 (410)";
  const desc = code === 404 ? "抱歉，短链不存在。" : "该短链已过期，请重新生成。";
  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100 overflow-hidden">
      <div className="fixed right-4 top-4 z-20 flex items-center gap-2">
        <a
          href="https://github.com/htnanako/x-url"
          target="_blank"
          rel="noreferrer"
          aria-label="打开 GitHub 仓库"
          className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 bg-white/80 backdrop-blur text-slate-700 shadow-sm hover:bg-white/90 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100"
        >
          <Github size={18} />
        </a>
        <button
          onClick={toggleTheme}
          aria-label="切换主题"
          className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 bg-white/80 backdrop-blur text-slate-700 shadow-sm hover:bg-white/90 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
      <div className="absolute inset-0 -z-10 bg-[length:200%_200%] bg-gradient-to-br from-indigo-200 via-rose-100 to-teal-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 animate-gradient-x" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-indigo-300/40 dark:bg-indigo-900/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-pink-300/40 dark:bg-pink-900/40 blur-3xl" />
      <div className="px-4 py-10 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <Card className="animate-scale-in">
            <CardContent>
              <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-700 to-pink-600 dark:from-white dark:via-indigo-200 dark:to-pink-200 bg-[length:200%_200%] animate-gradient-x">{title}</span>
                </h1>
                <p className="mt-4 text-slate-600 dark:text-slate-300">{desc}</p>
                <Button className="mt-6" onClick={() => (window.location.href = "/")}>返回首页</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <footer className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-500 dark:text-slate-400">
        © 2025 x-url · htnanako · 保留所有权利
      </footer>
    </div>
  );
}


