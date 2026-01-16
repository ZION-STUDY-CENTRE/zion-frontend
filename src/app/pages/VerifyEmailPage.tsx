import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/api";
import { Button } from "../components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage("Invalid verification link. No token found.");
            return;
        }

        // Avoid double-firing in StrictMode in dev
        let mounted = true;

        const verify = async () => {
            try {
                await verifyEmail(token);
                if(mounted) {
                    setStatus('success');
                    setMessage("Email verified successfully! You can now access your account.");
                }
            } catch (err: any) {
                if(mounted) {
                    setStatus('error');
                    setMessage(err.message || "Verification failed. The link may be invalid or expired.");
                }
            }
        };

        verify();

        return () => { mounted = false; };
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>Email Verification</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    {status === 'loading' && (
                        <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
                    )}
                    {status === 'success' && (
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    )}
                    {status === 'error' && (
                        <XCircle className="h-16 w-16 text-red-500" />
                    )}

                    <p className={`text-lg ${status === 'error' ? 'text-red-600' : 'text-slate-700'}`}>
                        {message}
                    </p>

                    {status !== 'loading' && (
                        <Button 
                            className="w-full"
                            onClick={() => navigate('/login')}
                        >
                            Go to Login
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
