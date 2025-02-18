FROM oven/bun:latest

WORKDIR /app

COPY  package.json bun.lockb ./

# Install dependencies 
# The --frozen-lockfile flag ensures you use the exact dependency versions
# specified in bun.lockb file, preventing unexpected issues in production.
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["bun", "start"]