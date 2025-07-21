import { LoginForm } from '@/components/auth/login-form';
import { Icons } from '@/components/icons';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-4">
          <Icons.logo className="h-16 w-16 text-primary" />
          <h1 className="font-headline text-3xl font-semibold tracking-tighter text-center">
            UIC Resource Hub
          </h1>
          <p className="text-muted-foreground text-center">
            Enter your credentials to access the portal.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
