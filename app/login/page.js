import LoginForm from './ui/LoginForm';

export const metadata = {
  title: 'Login | JKFC Admin',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb] p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">JK</div>
          <h1 className="mt-4 text-xl font-semibold text-gray-900">JKFC Admin</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}


