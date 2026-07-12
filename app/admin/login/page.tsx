import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold">콜리네 텃밭 관리자</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            관리자 계정으로 로그인하세요.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
