export default async (req) => {
if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 8500);
try {
const { messages } = await req.json();
const token = (process.env.HF_TOKEN || "").trim();
const res = await fetch("https://huggingface.co", {
method: "POST",
signal: controller.signal,
headers: {
"Authorization": "Bearer " + token,
"Content-Type": "application/json",
"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
},
body: JSON.stringify({
model: "meta-llama/Llama-3.2-3B-Instruct",
messages: messages,
max_tokens: 450,
temperature: 0.75
})
});
clearTimeout(timer);
const text = await res.text();
return new Response(text, {
status: res.status,
headers: { "Content-Type": "application/json" }
});
} catch (e) {
clearTimeout(timer);
return new Response(JSON.stringify({ error: "Таймаут или ошибка: " + e.message }), { status: 500 });
}
};
