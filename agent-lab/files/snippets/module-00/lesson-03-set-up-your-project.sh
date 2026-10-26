// terminal
mkdir docbot && cd docbot
npm init -y
npm pkg set type=module          # lets us use "import"
npm install @anthropic-ai/sdk dotenv

# create .env with your key (from console.anthropic.com)
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
echo ".env" > .gitignore
