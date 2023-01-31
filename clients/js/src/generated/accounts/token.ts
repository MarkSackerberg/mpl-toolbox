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
import { TokenState, getTokenStateSerializer } from '../types';

export type Token = Account<TokenAccountData>;

export type TokenAccountData = {
  mint: PublicKey;
  owner: PublicKey;
  amount: bigint;
  delegate: Option<PublicKey>;
  state: TokenState;
  isNative: Option<bigint>;
  delegatedAmount: bigint;
  closeAuthority: Option<PublicKey>;
};

export type TokenAccountArgs = {
  mint: PublicKey;
  owner: PublicKey;
  amount: number | bigint;
  delegate: Option<PublicKey>;
  state: TokenState;
  isNative: Option<number | bigint>;
  delegatedAmount: number | bigint;
  closeAuthority: Option<PublicKey>;
};

export async function fetchToken(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKey: PublicKey,
  options?: RpcGetAccountOptions
): Promise<Token> {
  const maybeAccount = await context.rpc.getAccount(publicKey, options);
  assertAccountExists(maybeAccount, 'Token');
  return deserializeToken(context, maybeAccount);
}

export async function safeFetchToken(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKey: PublicKey,
  options?: RpcGetAccountOptions
): Promise<Token | null> {
  const maybeAccount = await context.rpc.getAccount(publicKey, options);
  return maybeAccount.exists ? deserializeToken(context, maybeAccount) : null;
}

export async function fetchAllToken(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKeys: PublicKey[],
  options?: RpcGetAccountsOptions
): Promise<Token[]> {
  const maybeAccounts = await context.rpc.getAccounts(publicKeys, options);
  return maybeAccounts.map((maybeAccount) => {
    assertAccountExists(maybeAccount, 'Token');
    return deserializeToken(context, maybeAccount);
  });
}

export async function safeFetchAllToken(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKeys: PublicKey[],
  options?: RpcGetAccountsOptions
): Promise<Token[]> {
  const maybeAccounts = await context.rpc.getAccounts(publicKeys, options);
  return maybeAccounts
    .filter((maybeAccount) => maybeAccount.exists)
    .map((maybeAccount) =>
      deserializeToken(context, maybeAccount as RpcAccount)
    );
}

export function getTokenGpaBuilder(
  context: Pick<Context, 'rpc' | 'serializer' | 'programs'>
) {
  const s = context.serializer;
  return gpaBuilder<{
    mint: PublicKey;
    owner: PublicKey;
    amount: number | bigint;
    delegate: Option<PublicKey>;
    state: TokenState;
    isNative: Option<number | bigint>;
    delegatedAmount: number | bigint;
    closeAuthority: Option<PublicKey>;
  }>(context, context.programs.get('splToken').publicKey, [
    ['mint', s.publicKey],
    ['owner', s.publicKey],
    ['amount', s.u64],
    ['delegate', s.fixedOption(s.publicKey, s.u32)],
    ['state', getTokenStateSerializer(context)],
    ['isNative', s.fixedOption(s.u64, s.u32)],
    ['delegatedAmount', s.u64],
    ['closeAuthority', s.fixedOption(s.publicKey, s.u32)],
  ]).whereSize(165);
}

export function deserializeToken(
  context: Pick<Context, 'serializer'>,
  rawAccount: RpcAccount
): Token {
  return deserializeAccount(rawAccount, getTokenAccountDataSerializer(context));
}

export function getTokenAccountDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<TokenAccountArgs, TokenAccountData> {
  const s = context.serializer;
  return s.struct<TokenAccountData>(
    [
      ['mint', s.publicKey],
      ['owner', s.publicKey],
      ['amount', s.u64],
      ['delegate', s.fixedOption(s.publicKey, s.u32)],
      ['state', getTokenStateSerializer(context)],
      ['isNative', s.fixedOption(s.u64, s.u32)],
      ['delegatedAmount', s.u64],
      ['closeAuthority', s.fixedOption(s.publicKey, s.u32)],
    ],
    'Token'
  ) as Serializer<TokenAccountArgs, TokenAccountData>;
}

export function getTokenSize(_context = {}): number {
  return 165;
}
