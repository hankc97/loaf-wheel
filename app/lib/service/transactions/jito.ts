// TG BOT infra is in amsterdam
export const JITO_CONN_TXN_URL = "https://amsterdam.mainnet.block-engine.jito.wtf/api/v1/transactions";

// Tip account most likely to work in case fetch fails
export const JITO_DEFAULT_TIP_ACCOUNT = "3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT";

export const JITO_TIP_ACCOUNTS = [
    "96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5",
    "HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe",
    "Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY",
    "ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49",
    "DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh",
    "ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt",
    "DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL",
    "3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT",
] as const;

export const Jito = {
    TIP_AMOUNT_LAMPORTS: 250_000,

    /**
     * The maximum amount of time to wait for a Jito connection to land a
     * transaction.
     *
     * Jito maxes out around 10s, making this a bit higher to be safe.
     */
    MAXIMUM_POLL_TIME_MS: 20_000,
} as const;

export const TXN_RPC_URLS = [
    "https://lingering-special-daylight.solana-mainnet.quiknode.pro/6597b9924b286067070d23e5e2080228c5b3b429/",
    "https://mainnet.helius-rpc.com/?api-key=74b110ab-eda6-4e21-9f40-90f406f79c0a",
    "https://api.mainnet-beta.solana.com/",
    "https://tokyo.solana-mainnet.hellomoon.io/78ff05a2-e54e-4a98-a5f5-5d09ee3bffaf/",
    "https://la.solana-mainnet.hellomoon.io/78ff05a2-e54e-4a98-a5f5-5d09ee3bffaf/",
    "https://ashburn.solana-mainnet.hellomoon.io/78ff05a2-e54e-4a98-a5f5-5d09ee3bffaf/",
    "https://frankfurt.solana-mainnet.hellomoon.io/78ff05a2-e54e-4a98-a5f5-5d09ee3bffaf/",
    "https://london.solana-mainnet.hellomoon.io/78ff05a2-e54e-4a98-a5f5-5d09ee3bffaf/",
];
