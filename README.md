Como rodar corretamente

Se quiser iniciar o backend:
(N/A DB?)
pnpm --filter @workspace/api-server run dev

Se quiser iniciar o app mobile (FRONT):

pnpm --filter @workspace/mobile run dev


Se quiser iniciar o mockup sandbox:

LINUX:
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/mockup-sandbox run dev

WINDOWS CMD: 
set PORT=3000&& set BASE_PATH=/&& pnpm --filter @workspace/mockup-sandbox run dev

POWERSHELL:
$env:PORT = "3000"; $env:BASE_PATH = "/"; pnpm --filter @workspace/mockup-sandbox run dev

