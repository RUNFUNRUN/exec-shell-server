To install dependencies:

```sh
bun install
```

To set environment variables:

```sh
echo "TOKEN=$(openssl rand -base64 32)" > .env
```

To run:

```sh
bun start
```

Hot reload:

```sh
bun run dev
```

open <http://localhost:3000>
