export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="relative z-10 pt-6 pb-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 manifestation-gradient rounded-full" />
              <span className="text-2xl font-bold text-foreground">ManifestAI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">Early Access</span>
              <a href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Sign In
              </a>
              <a href="/auth/signup" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                Get Started Free
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
                Turn Your{' '}
                <span className="relative">
                  <span className="manifestation-gradient bg-clip-text text-transparent">
                    Dreams
                  </span>
                </span>
                {' '}Into Reality
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                The world's most advanced AI-powered manifestation platform. 
                Create vision boards, get personalized coaching, and achieve your goals with intelligent guidance.
              </p>
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Limited to First 500 Users
                </span>
                <span className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">127</span> spots remaining
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="/auth/signup" className="group bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-all duration-300 text-lg font-semibold flex items-center gap-2">
                Start Free - No Card Required
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <button className="bg-background border border-border text-foreground px-8 py-4 rounded-lg hover:bg-secondary/50 transition-all duration-300 text-lg font-semibold">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                <div className="text-muted-foreground">Dreams Achieved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-muted-foreground">AI Models</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of personal development with our cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">AI Manifestation Coach</h3>
              <p className="text-muted-foreground">Get personalized coaching powered by advanced AI that understands your unique goals and challenges.</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Smart Vision Boards</h3>
              <p className="text-muted-foreground">Create beautiful, AI-enhanced vision boards that adapt and evolve with your progress.</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Instant Insights</h3>
              <p className="text-muted-foreground">Receive real-time feedback and insights to keep you motivated and on track.</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Community Support</h3>
              <p className="text-muted-foreground">Connect with like-minded individuals and accountability partners on the same journey.</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Privacy First</h3>
              <p className="text-muted-foreground">Your dreams and data are protected with enterprise-grade security and privacy controls.</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Proven Results</h3>
              <p className="text-muted-foreground">Join thousands who have already achieved their dreams with our proven methodology.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-20 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Start Manifesting in 3 Simple Steps
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the early access program and transform your dreams into reality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Free Account</h3>
              <p className="text-muted-foreground">Sign up in seconds. No credit card required. Be one of the first 500 users.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Set Your Dreams & Goals</h3>
              <p className="text-muted-foreground">Tell our AI about your aspirations and create beautiful vision boards.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Daily AI Guidance</h3>
              <p className="text-muted-foreground">Receive personalized coaching and track your progress to success.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-12 shadow-xl">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Ready to Manifest Your Dreams?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Join our exclusive early access program. First 500 users get lifetime free access to core features.
              </p>
              <a href="/auth/signup" className="group bg-primary text-primary-foreground px-12 py-4 rounded-lg hover:bg-primary/90 transition-all duration-300 text-xl font-semibold hover:shadow-lg hover:shadow-primary/25 inline-flex items-center">
                Claim Your Free Spot
                <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card • No hidden fees • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 manifestation-gradient rounded-full" />
              <span className="text-xl font-bold text-foreground">ManifestAI</span>
            </div>
            <div className="text-muted-foreground text-center md:text-right">
              <p>© 2024 ManifestAI. All rights reserved.</p>
              <p className="text-sm mt-1">Powered by Advanced AI Technology</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}