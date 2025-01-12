import React, { useState } from 'react';
import { createEvent } from '../supabaseClient';

export default function ImageGenerator() {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (loading || !prompt.trim()) return;
        setLoading(true);
        setImageUrl('');

        try {
            const result = await createEvent('generate_image', {
                prompt
            });
            setImageUrl(result.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleGenerate} className="flex flex-col space-y-2">
                <label htmlFor="imagePrompt" className="text-lg">Generate an Image:</label>
                <input
                    id="imagePrompt"
                    type="text"
                    className="border border-gray-300 rounded p-2 box-border"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want"
                />
                <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded cursor-pointer disabled:opacity-50" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Image'}
                </button>
            </form>
            {imageUrl && (
                <div className="mt-4">
                    <h3 className="text-xl font-semibold">Generated Image:</h3>
                    <img src={imageUrl} alt="Generated" className="mt-2 max-w-full h-auto rounded" />
                </div>
            )}
        </div>
    );
}