import React, { useState } from 'react';
import { createEvent } from '../supabaseClient';

export default function PDFInterpreter() {
    const [file, setFile] = useState(null);
    const [interpretation, setInterpretation] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleInterpret = async (e) => {
        e.preventDefault();
        if (loading || !file) return;
        setLoading(true);
        setInterpretation('');

        const formData = new FormData();
        formData.append('pdf', file);

        try {
            // Assuming there's an API route to handle PDF interpretation
            const response = await fetch('/api/interpret-pdf', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to interpret PDF');
            }

            const data = await response.json();
            setInterpretation(data.interpretation);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleInterpret} className="flex flex-col space-y-2">
                <label htmlFor="pdfFile" className="text-lg">Upload PDF for Interpretation:</label>
                <input
                    id="pdfFile"
                    type="file"
                    accept="application/pdf"
                    className="border border-gray-300 rounded p-2 box-border"
                    onChange={handleFileChange}
                />
                <button type="submit" className="bg-purple-500 text-white py-2 px-4 rounded cursor-pointer disabled:opacity-50" disabled={loading || !file}>
                    {loading ? 'Interpreting...' : 'Interpret PDF'}
                </button>
            </form>
            {interpretation && (
                <div className="mt-4">
                    <h3 className="text-xl font-semibold">Interpretation:</h3>
                    <p className="mt-2">{interpretation}</p>
                </div>
            )}
        </div>
    );
}