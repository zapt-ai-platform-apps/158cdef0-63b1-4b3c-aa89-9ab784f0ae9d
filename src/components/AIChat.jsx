import React, { useState } from 'react';
import { createEvent } from '../supabaseClient';

export default function AIChat() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [voiceUrl, setVoiceUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading || !question.trim()) return;
        setLoading(true);
        setAnswer('');
        setVoiceUrl('');

        try {
            const result = await createEvent('chatgpt_request', {
                prompt: question,
                response_type: 'text'
            });
            setAnswer(result.data);
            // Example: Handle text-to-speech API call
            const voiceResponse = await createEvent('text_to_speech', {
                text: result.data
            });
            setVoiceUrl(voiceResponse.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                <label htmlFor="question" className="text-lg">Ask AI anything:</label>
                <input
                    id="question"
                    type="text"
                    className="border border-gray-300 rounded p-2 box-border"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type your question here"
                />
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer disabled:opacity-50" disabled={loading}>
                    {loading ? 'Loading...' : 'Submit'}
                </button>
            </form>
            {answer && (
                <div className="mt-4">
                    <h3 className="text-xl font-semibold">Answer:</h3>
                    <p className="mt-2">{answer}</p>
                    {voiceUrl && (
                        <audio controls className="mt-2">
                            <source src={voiceUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    )}
                </div>
            )}
        </div>
    );
}