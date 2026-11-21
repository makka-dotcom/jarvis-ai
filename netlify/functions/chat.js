export default async (req) => {
 if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
 try {
 const { messages } = await req.json();
 const token = (process.env.HF_TOKEN || "").trim();
 const res = await fetch("https://huggingface.co", {
 method: "POST",
 headers: {
 "Authorization": "Bearer " + token,
 "Content-Type": "application/json"
 },
 body: JSON.stringify({
 model: "Qwen/Qwen2.5-72B-Instruct",
 messages: messages,
 max_tokens: 600,
 temperature: 0.75
 })
 });
 const text = await res.text();
 return new Response(text, {
 status: res.status,
 headers: { "Content-Type": "application/json" }
 });
 } catch (e) {
 return new Response(JSON.stringify({ error: e.message }), { status: 500 });
 }
};