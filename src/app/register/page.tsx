import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] section-padding py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-2">
            إنشاء حساب
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            انضم إلى مجتمع RATQ وابدأ في مشاركة واستخدام الموارد
          </p>
        </div>

        <div className="card p-6">
          <RegisterForm />
        </div>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="text-[var(--accent-primary)] font-semibold hover:underline">
            سجل دخولك
          </Link>
        </p>
      </div>
    </div>
  );
}
