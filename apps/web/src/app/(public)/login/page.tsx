"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginRegisterPage() {
  const router = useRouter();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email: registerEmail,
      password: registerPassword,
      options: {
        data: { full_name: registerName },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setError(null);
    alert(
      "Registration successful! Please check your email to confirm your account before logging in."
    );
  };

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 relative overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none">
        
        <div className="absolute top-3/4 left-1/2 w-60 h-60 md:w-96 md:h-96 lg:w-[50rem] lg:h-[60rem] mix-blend-multiply filter blur-3xl opacity-85 animate-orbit-1">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#1e3a8a", stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: "#3b82f6", stopOpacity: 0.3 }} />
              </linearGradient>
            </defs>
            <polygon points="50,10 90,90 10,90" fill="url(#grad1)" />
          </svg>
        </div>

        {/* Blob 2 - Yellow */}
        <div className="absolute top-1/2 left-1/2 w-60 h-60 md:w-96 md:h-96 lg:w-[30rem] lg:h-[30rem] mix-blend-multiply filter blur-3xl opacity-90 animate-orbit-2">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#eab308", stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: "#facc15", stopOpacity: 0.3 }} />
              </linearGradient>
            </defs>
            <polygon points="50,10 90,90 10,90" fill="url(#grad2)" />
          </svg>
        </div>

        {/* Blob 3 - Light Blue */}
        <div className="absolute top-1/2 left-1/2 w-60 h-60 md:w-96 md:h-96 lg:w-[60rem] lg:h-[60rem] mix-blend-multiply filter blur-3xl opacity-90 animate-orbit-3">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#0ea5e9", stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: "#38bdf8", stopOpacity: 0.3 }} />
              </linearGradient>
            </defs>
            <polygon points="50,10 90,90 10,90" fill="url(#grad3)" />
          </svg>
        </div>
      </div>

      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="text-center">
          <img
            src="./imports/emblem.png"
            alt="TrustChain Emblem"
            className="w-30 h-24 mx-auto -mb-7"
          />
          <CardTitle className="text-3xl text-blue-900">
            Welcome to
            <span className="text-blue-900 font-bold text-3xl"> Trust</span>
            <span className="text-[#FACC15] font-bold">Chain</span>
          </CardTitle>
          <CardDescription className="text-[14px]">
            Login or create an account to start helping
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full text-[16px]">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-[#FACC15]/60 text-[var(--secondary)]"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-[#FACC15]/60 text-[var(--secondary)"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="user@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={handleGoogleLogin}
                >
                  Continue with Google
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="John Doe"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="you@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </form>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or register with
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={handleGoogleLogin}
                >
                  Continue with Google
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes orbit {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(40vw) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(40vw) rotate(-360deg);
          }
        }
        
        .animate-orbit-1 {
          animation: orbit 20s linear infinite;
        }
        
        .animate-orbit-2 {
          animation: orbit 20s linear infinite;
          animation-delay: -6.66s;
        }
        
        .animate-orbit-3 {
          animation: orbit 20s linear infinite;
          animation-delay: -13.33s;
        }
      `}</style>
    </div>
  );
}