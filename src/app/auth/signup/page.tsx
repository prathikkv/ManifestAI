import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 manifestation-gradient rounded-full" />
            <span className="text-2xl font-bold text-foreground">ManifestAI</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Start Your Journey</h1>
          <p className="text-muted-foreground">
            Create your free account and join the manifestation movement
          </p>
          
          <div className="bg-primary/10 text-primary text-center py-2 px-4 rounded-lg mt-4 text-sm font-semibold">
            🎉 Only 127 free spots remaining!
          </div>
        </div>

        <div className="flex justify-center">
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: 'bg-primary hover:bg-primary/90',
                card: 'bg-card/50 backdrop-blur-sm border border-border shadow-xl',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
              }
            }}
            redirectUrl="/dashboard"
          />
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          By creating an account, you agree to our{' '}
          <Link href="#" className="underline">Terms</Link> and{' '}
          <Link href="#" className="underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}