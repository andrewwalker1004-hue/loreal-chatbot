# L'Oréal Smart Routine & Product Advisor

A branded chatbot that answers questions about L'Oréal products and routines,
powered by the OpenAI API through a Cloudflare Worker (so the API key never
ships to the browser).

## Structure

- `index.html`, `style.css`, `script.js` — the frontend chat UI.
- `worker/src/index.js` — Cloudflare Worker that holds the system prompt and
  proxies requests to OpenAI.
- `worker/wrangler.toml` — Worker config.

## 1. Deploy the Worker

```bash
cd worker
npm create cloudflare@latest -- --existing-script   # or: npm install -g wrangler
npx wrangler login
npx wrangler secret put OPENAI_API_KEY   # paste your OpenAI key when prompted
npx wrangler deploy
```

After deploying, Wrangler prints your Worker URL, e.g.
`https://loreal-chatbot-worker.<your-subdomain>.workers.dev`.

## 2. Point the frontend at your Worker

In `script.js`, update:

```js
const WORKER_URL = "https://loreal-chatbot-worker.<your-subdomain>.workers.dev";
```

## 3. Run the frontend locally

Any static file server works, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open the shown URL in your browser.

## Rubric coverage

- **L'Oréal branding** — logo wordmark, black/white palette, serif logo font.
- **Chatbot configuration** — system prompt in the Worker, user input captured
  and sent to OpenAI, response rendered in the chat window.
- **AI relevance** — system prompt instructs the model to only discuss L'Oréal
  products/routines and decline unrelated topics.
- **Secure deployment** — the OpenAI key lives only as a Worker secret; the
  browser calls the Worker, never OpenAI directly.
- **Conversation memory (LevelUp)** — `script.js` keeps a running `history`
  array and sends it with every request.
- **User question above response (LevelUp)** — each turn renders as a user
  bubble immediately followed by the bot's reply.
- **Chat bubble UI (LevelUp)** — `style.css` gives user/bot messages distinct
  alignment and coloring.

## Still to do (yours to write)

The reflection questions ("Building a Chatbot", "Talking Points", "L'Oréal
Recruiter") are personal-response prompts from the assignment page — fill
those in directly on HQ in your own words.
