import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonGroup } from "@/components/ui/button-group";
import { Check, Copy, Link as LinkIcon, Moon, Sun, QrCode, Github, Download } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { toastConfig, getResponsiveContainerConfig } from "@/config/toastConfig";


export default function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [qrClosing, setQrClosing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customCode, setCustomCode] = useState("");

  useEffect(() => setMounted(true), []);

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

  function openQr() {
    if (!shortUrl) return;
    setShowQr(true);
    setQrClosing(false);
  }

  function closeQr() {
    setQrClosing(true);
    setTimeout(() => {
      setShowQr(false);
      setQrClosing(false);
    }, 380);
  }

  const isInvalid = useMemo(() => {
    if (!url) return false;
    return !(url.startsWith("http://") || url.startsWith("https://"));
  }, [url]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setShortUrl(null);
    setExpiresAt(null);
    if (isInvalid || !url) {
      const errorMsg = "请输入以 http(s):// 开头的 URL";
      setError(errorMsg);
      toast.error(errorMsg, toastConfig.error);
      return;
    }
    setLoading(true);
    try {
      const payload: { url: string; code?: string } = { url };
      if (customCode.trim()) {
        payload.code = customCode.trim();
      }
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.error || "创建失败";
        setError(errorMsg);
        toast.error(errorMsg, toastConfig.error);
      } else {
        // 前端默认用当前访问 base url 拼接
        const built = `${window.location.origin}/${data.code}`;
        setCode(data.code);
        setShortUrl(built);
        if (data.expires_at) setExpiresAt(data.expires_at);
        toast.success("短链生成成功！", toastConfig.success);
        // 清除自定义短码
        setCustomCode("");
        // 自动复制到剪贴板
        try {
          await navigator.clipboard.writeText(built);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch (e) {
          // ignore clipboard errors
        }
      }
    } catch (err) {
      const errorMsg = "网络错误，请稍后再试";
      setError(errorMsg);
      toast.error(errorMsg, toastConfig.error);
    } finally {
      setLoading(false);
    }
  }

  async function onCopy() {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success("已复制到剪贴板", toastConfig.success);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      toast.error("复制失败，请手动复制", toastConfig.error);
    }
  }

  async function onDownloadQr(e: React.MouseEvent) {
    e.stopPropagation();
    if (!shortUrl || !code) return;
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(shortUrl)}`;
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${code}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("二维码下载成功", toastConfig.success);
    } catch (err) {
      toast.error("下载失败，请稍后再试", toastConfig.error);
    }
  }

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Toast 容器 */}
      <Toaster
        position={toastConfig.default.position}
        toastOptions={{
          ...toastConfig.default,
          style: {
            ...toastConfig.default.style,
          },
        }}
        containerStyle={getResponsiveContainerConfig().style}
        containerClassName={getResponsiveContainerConfig().className}
      />
      
      {/* top-right actions */}
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
      {/* animated gradient background */}
      <div className="absolute inset-0 -z-10 bg-[length:200%_200%] bg-gradient-to-br from-indigo-200 via-rose-100 to-teal-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 animate-gradient-x" />
      {/* blurred color blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-indigo-300/40 dark:bg-indigo-900/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-pink-300/40 dark:bg-pink-900/40 blur-3xl" />

      <div className="px-4 py-10 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-xl">
          <Card className={`${mounted ? 'animate-scale-in' : 'opacity-0'}`}>
            <CardContent>
              <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight flex items-center justify-center gap-3">
                  <img src="/img/logo.png" alt="x-url logo" className="h-10 w-10 rounded" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-700 to-pink-600 dark:from-white dark:via-indigo-200 dark:to-pink-200 bg-[length:200%_200%] animate-gradient-x">x-url</span>
                </h1>
                <p className="mt-4 text-slate-600 dark:text-slate-300">输入长链接，获取可分享的短链。</p>
              </div>

              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="url-input" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    长链接
                  </label>
                  <div className="relative flex-1">
                    <Input
                      id="url-input"
                      className={`h-12 pr-9 ${isInvalid ? 'border-rose-400 focus:ring-rose-200' : ''}`}
                      placeholder="https://example.com/very/long/url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    {/* link icon */}
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <LinkIcon size={18} />
                    </span>
                  </div>
                </div>
                {showAdvanced && (
                  <div className="flex flex-col gap-2 animate-fade-up">
                    <label htmlFor="custom-code-input" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      自定义短码
                    </label>
                    <ButtonGroup prefix={window.location.origin + "/"}>
                      <Input
                        id="custom-code-input"
                        className="h-12 border-0 shadow-none focus:ring-0 dark:bg-transparent"
                        placeholder="输入自定义短码（可选）"
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value)}
                      />
                    </ButtonGroup>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      留空则由系统自动生成短码
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {showAdvanced ? "隐藏高级选项" : "高级选项"}
                  </button>
                </div>
                <Button className="h-12 w-full whitespace-nowrap" disabled={loading}>
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                      </svg>
                      生成中...
                    </span>
                  ) : (
                    "生成"
                  )}
                </Button>
              </form>

              {error && (
                <p className="mt-4 text-rose-600 text-sm animate-fade-up">{error}</p>
              )}

              {shortUrl && (
                <div className="mt-6 animate-fade-up">
                  <label htmlFor="short-url-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    短链接
                  </label>
                  <div id="short-url-input" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-800/80 px-3 py-2">
                    <a className="inline-flex items-center gap-2 font-medium min-w-0 flex-1 text-slate-900 dark:text-slate-100" href={shortUrl}>
                      <LinkIcon size={18} />
                      <span className="truncate">{shortUrl}</span>
                    </a>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button
                      type="button"
                      onClick={onCopy}
                      aria-label="复制短链"
                      variant="secondary"
                      className={`h-12 w-1/2 justify-center ${
                        copied
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-500 dark:text-emerald-300'
                          : 'dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 hover:dark:bg-slate-800/90'
                      }`}
                    >
                      {copied ? (
                        <span className="inline-flex items-center gap-2">
                          <Check size={18} /> 已复制
                        </span>
                      ) : (
                        '复制链接'
                      )}
                    </Button>
                    <Button
                      type="button"
                      aria-label="生成二维码"
                      onClick={openQr}
                      variant="secondary"
                      className="h-12 w-1/2 justify-center dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 hover:dark:bg-slate-800/90"
                    >
                      生成二维码
                    </Button>
                  </div>
                  {code && (
                    <p className="mt-1 text-xs text-slate-500">短码：<span className="font-mono">{code}</span></p>
                  )}
                  {expiresAt && (
                    <p className="mt-1 text-xs text-slate-500">到期时间：<span className="font-mono">{new Date(expiresAt).toLocaleString()}</span></p>
                  )}
                </div>
              )}

              <p className="mt-6 text-sm text-slate-600">
                默认有效期 <span className="font-semibold">90 天</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Modal */}
      {showQr && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 backdrop-blur-md"
          onClick={closeQr}
        >
          <div
            className={`rounded-2xl border border-white/50 bg-white/70 backdrop-blur-md shadow-xl dark:border-slate-700/60 dark:bg-slate-800/60 transform-gpu ${qrClosing ? 'animate-flip-out' : 'animate-flip-in'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 w-[440px] max-w-[90vw]">
              <div className="flex flex-col items-center text-center">
                {shortUrl && (
                  <div className="relative rounded-2xl bg-white p-5 shadow-lg overflow-hidden dark:bg-white">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(shortUrl)}`}
                      alt="短链二维码"
                      className="h-[320px] w-[320px] max-w-[80vw] max-h-[70vh] block"
                    />
                    {code && (
                      <button
                        onClick={onDownloadQr}
                        aria-label="下载二维码"
                        className="absolute top-2 right-2 z-10 inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 bg-white/90 backdrop-blur text-slate-700 shadow-md hover:bg-white hover:shadow-lg transition-all"
                      >
                        <Download size={18} />
                      </button>
                    )}
                  </div>
                )}
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">使用手机扫描二维码访问短链</p>
                {shortUrl && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 break-all">{shortUrl}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-500 dark:text-slate-400">
        © 2025 x-url · htnanako · 保留所有权利
      </footer>
    </div>
  );
}


