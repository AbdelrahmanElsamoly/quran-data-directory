import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] section-padding py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-2">
            تسجيل الدخول
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            مرحباً بعودتك! قم بتسجيل دخولك للمتابعة
          </p>
        </div>

        <div className="card p-6">
          <LoginForm />
        </div>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          ليس لديك حساب؟{' '}
          <Link href="/register" className="text-[var(--accent-primary)] font-semibold hover:underline">
            سجل الآن
          </Link>
        </p>
      </div>
    </div>
  );
}
