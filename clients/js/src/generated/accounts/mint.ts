/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Account,
  Context,
  Option,
  PublicKey,
  RpcAccount,
  RpcGetAccountOptions,
  RpcGetAccountsOptions,
  Serializer,
  assertAccountExists,
  deserializeAccount,
  gpaBuilder,
} from '@lorisleiva/js-core';

export type Mint = Account<MintAccountData>;

export type MintAccountData = {
  mintAuthority: Option<PublicKey>;
  supply: bigint;
  decimals: number;
  isInitialized: boolean;
  freezeAuthority: Option<PublicKey>;
};

export type MintAccountArgs = {
  mintAuthority: Option<PublicKey>;
  supply: number | bigint;
  decimals: number;
  isInitialized: boolean;
  freezeAuthority: Option<PublicKey>;
};

export async function fetchMint(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKey: PublicKey,
  options?: RpcGetAccountOptions
): Promise<Mint> {
  const maybeAccount = await context.rpc.getAccount(publicKey, options);
  assertAccountExists(maybeAccount, 'Mint');
  return deserializeMint(context, maybeAccount);
}

export async function safeFetchMint(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKey: PublicKey,
  options?: RpcGetAccountOptions
): Promise<Mint | null> {
  const maybeAccount = await context.rpc.getAccount(publicKey, options);
  return maybeAccount.exists ? deserializeMint(context, maybeAccount) : null;
}

export async function fetchAllMint(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKeys: PublicKey[],
  options?: RpcGetAccountsOptions
): Promise<Mint[]> {
  const maybeAccounts = await context.rpc.getAccounts(publicKeys, options);
  return maybeAccounts.map((maybeAccount) => {
    assertAccountExists(maybeAccount, 'Mint');
    return deserializeMint(context, maybeAccount);
  });
}

export async function safeFetchAllMint(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKeys: PublicKey[],
  options?: RpcGetAccountsOptions
): Promise<Mint[]> {
  const maybeAccounts = await context.rpc.getAccounts(publicKeys, options);
  return maybeAccounts
    .filter((maybeAccount) => maybeAccount.exists)
    .map((maybeAccount) =>
      deserializeMint(context, maybeAccount as RpcAccount)
    );
}

export async function getMintGpaBuilder(
  context: Pick<Context, 'rpc' | 'serializer' | 'programs'>,
  publicKey: PublicKey
) {
  const s = context.serializer;
  return gpaBuilder<{
    mintAuthority: Option<PublicKey>;
    supply: number | bigint;
    decimals: number;
    isInitialized: boolean;
    freezeAuthority: Option<PublicKey>;
  }>(context, context.programs.get('splToken').publicKey, [
    ['mintAuthority', s.fixedOption(s.publicKey, s.u32)],
    ['supply', s.u64],
    ['decimals', s.u8],
    ['isInitialized', s.bool()],
    ['freezeAuthority', s.fixedOption(s.publicKey, s.u32)],
  ]).whereSize(82);
}

export function deserializeMint(
  context: Pick<Context, 'serializer'>,
  rawAccount: RpcAccount
): Mint {
  return deserializeAccount(rawAccount, getMintAccountDataSerializer(context));
}

export function getMintAccountDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<MintAccountArgs, MintAccountData> {
  const s = context.serializer;
  return s.struct<MintAccountData>(
    [
      ['mintAuthority', s.fixedOption(s.publicKey, s.u32)],
      ['supply', s.u64],
      ['decimals', s.u8],
      ['isInitialized', s.bool()],
      ['freezeAuthority', s.fixedOption(s.publicKey, s.u32)],
    ],
    'Mint'
  ) as Serializer<MintAccountArgs, MintAccountData>;
}

export function getMintSize(_context = {}): number {
  return 82;
}
