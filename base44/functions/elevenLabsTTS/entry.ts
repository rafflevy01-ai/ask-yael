import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const ELEVENLABS_API_KEY = "e4929f62c3a4284f9345b59ba414a5ebfe40a82e43201a34cacf6bcd949495f6";
const VOICE_ID = "l4Coq6695JDX9xtLqXDE";

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    const chunks = [];
    const chunkSize = 0x8000; // 32KB chunks to avoid stack overflow
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        chunks.push(String.fromCharCode(...chunk));
    }
    return btoa(chunks.join(""));
}

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);

        const body = await req.json();
        const { text } = body;

        if (!text) {
            return Response.json({ error: "Missing text parameter" }, { status: 400 });
        }

        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
            {
                method: "POST",
                headers: {
                    "xi-api-key": ELEVENLABS_API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: text,
                    model_id: "eleven_multilingual_v2",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            return Response.json({ error: `ElevenLabs API error: ${errorText}` }, { status: response.status });
        }

        const audioBuffer = await response.arrayBuffer();
        const base64Audio = arrayBufferToBase64(audioBuffer);

        return Response.json({ audio: base64Audio });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});