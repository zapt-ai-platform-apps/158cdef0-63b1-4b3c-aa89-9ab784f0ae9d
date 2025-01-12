import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import AIChat from './components/AIChat';
import ImageGenerator from './components/ImageGenerator';
import PDFInterpreter from './components/PDFInterpreter';

export default function App() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
        };

        getSession();

        const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <div className="h-full flex flex-col justify-center items-center p-4">
                {!session ? (
                    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
                        <h2 className="text-2xl mb-4 text-center">Sign in with ZAPT</h2>
                        <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mb-4 block text-center">
                            Visit ZAPT
                        </a>
                        <Auth
                            supabaseClient={supabase}
                            appearance={{ theme: ThemeSupa }}
                            theme="default"
                            providers={['google', 'facebook', 'apple']}
                            className="box-border"
                        />
                    </div>
                ) : (
                    <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow flex flex-col space-y-6">
                        <h2 className="text-2xl mb-4">Welcome to the AI App</h2>
                        <AIChat />
                        <ImageGenerator />
                        <PDFInterpreter />
                        <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline text-right cursor-pointer">
                            Made on ZAPT
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}