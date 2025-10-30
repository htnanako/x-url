import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Copy, Link as LinkIcon } from "lucide-react";


export default function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

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
      setError("请输入以 http(s):// 开头的 URL");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "创建失败");
      } else {
        // 前端默认用当前访问 base url 拼接
        const built = `${window.location.origin}/${data.code}`;
        setCode(data.code);
        setShortUrl(built);
        if (data.expires_at) setExpiresAt(data.expires_at);
      }
    } catch (err) {
      setError("网络错误，请稍后再试");
    } finally {
      setLoading(false);
    }
  }

  async function onCopy() {
    if (!shortUrl) return;
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative min-h-screen text-slate-900 overflow-hidden">
      {/* animated gradient background */}
      <div className="absolute inset-0 -z-10 bg-[length:200%_200%] bg-gradient-to-br from-indigo-200 via-rose-100 to-teal-100 animate-gradient-x" />
      {/* blurred color blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-indigo-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-pink-300/40 blur-3xl" />

      <div className="px-4 py-10 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <Card className={`${mounted ? 'animate-scale-in' : 'opacity-0'}`}>
            <CardContent>
              <div className="mb-6 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-700 to-pink-600 bg-[length:200%_200%] animate-gradient-x">x-url</span>
                </h1>
                <p className="mt-2 text-slate-600">输入长链接，获取可分享的短链。</p>
              </div>

              <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Input
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
                <Button className="h-12 w-full sm:w-auto whitespace-nowrap" disabled={loading}>
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
                <p className="mt-3 text-rose-600 text-sm animate-fade-up">{error}</p>
              )}

              {shortUrl && (
                <div className="mt-5 animate-fade-up">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2">
                    <a className="inline-flex items-center gap-2 text-indigo-700 hover:text-indigo-800 font-medium min-w-0 flex-1" href={shortUrl}>
                      <LinkIcon size={18} />
                      <span className="truncate">{shortUrl}</span>
                    </a>
                    <Button
                      onClick={onCopy}
                      variant="secondary"
                      className={`h-10 px-3 text-sm shrink-0 whitespace-nowrap ${copied ? 'border-emerald-300 text-emerald-700' : ''}`}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? "已复制" : "复制"}
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

      {/* toast */}
      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 text-white text-sm px-4 py-2 shadow-lg animate-scale-in">
          已复制到剪贴板
        </div>
      )}
    </div>
  );
}


