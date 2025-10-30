import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StatusPage({ code }: { code: 404 | 410 }) {
  const title = code === 404 ? "链接不存在 (404)" : "链接已过期 (410)";
  const desc = code === 404 ? "抱歉，短链不存在。" : "该短链已过期，请重新生成。";
  return (
    <div className="relative min-h-screen text-slate-900 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[length:200%_200%] bg-gradient-to-br from-indigo-200 via-rose-100 to-teal-100 animate-gradient-x" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-indigo-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-pink-300/40 blur-3xl" />
      <div className="px-4 py-10 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <Card className="animate-scale-in">
            <CardContent>
              <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-700 to-pink-600 bg-[length:200%_200%] animate-gradient-x">{title}</span>
                </h1>
                <p className="mt-4 text-slate-600">{desc}</p>
                <Button className="mt-6" onClick={() => (window.location.href = "/")}>返回首页</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


