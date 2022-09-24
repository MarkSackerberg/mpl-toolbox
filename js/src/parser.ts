import {
  CandyGuardData,
  botTaxBeet,
  lamportsBeet,
  splTokenBeet,
  thirdPartySignerBeet,
  gatekeeperBeet,
  allowListBeet,
  startDateBeet,
  tokenGateBeet,
} from './generated/types';
import { BN } from 'bn.js';
import * as beet from '@metaplex-foundation/beet';
import { logDebug } from './utils/log';
import { mintLimitBeet } from './generated/types/MintLimit';
import { GuardSet } from './generated/types/GuardSet';
import { nftPaymentBeet } from './generated/types/NftPayment';
import { Group } from './generated/types/Group';
import { endDateBeet } from './generated/types/EndDate';
import { redemeedAmountBeet } from './generated/types/RedemeedAmount';
import { addressGateBeet } from './generated/types/AddressGate';

/**
 * Matching the guards of the related struct in the Rust program.
 * Make sure to update this whenever the Rust struct changes.
 * ```
 * pub struct GuardSet {
 *   /// Last instruction check and bot tax (penalty for invalid transactions).
 *   pub bot_tax: Option<BotTax>,
 *   /// Lamports guard (set the price for the mint in lamports).
 *   pub lamports: Option<Lamports>,
 *   /// Spl-token guard (set the price for the mint in spl-token amount).
 *   pub spl_token: Option<SplToken>,
 *   /// Start data guard (controls when minting is allowed).
 *   pub start_date: Option<StartDate>,
 *   /// Third party signer guard.
 *   pub third_party_signer: Option<ThirdPartySigner>,
 *   /// Whitelist guard (whitelist mint settings).
 *   pub token_gate: Option<TokenGate>,
 *   /// Gatekeeper guard
 *   pub gatekeeper: Option<Gatekeeper>,
 *   /// End date guard
 *   pub end_date: Option<EndDate>,
 *   /// Allow list guard
 *   pub allow_list: Option<AllowList>,
 *   /// Mint limit guard
 *   pub mint_limit: Option<MintLimit>,
 *   /// NFT Payment
 *   pub nft_payment: Option<NftPayment>,
 *   /// Redeemed amount guard
 *   pub redemeed_amount: Option<RedemeedAmount>,
 *   /// Address gate
 *   pub address_gate: Option<AddressGate>,
 * }
 * ```
 */

type Guards = {
  /* 01 */ botTaxEnabled: boolean;
  /* 02 */ lamportsEnabled: boolean;
  /* 03 */ splTokenEnabled: boolean;
  /* 04 */ startDateEnabled: boolean;
  /* 05 */ thirdPartySignerEnabled: boolean;
  /* 06 */ tokenGateEnabled: boolean;
  /* 07 */ gatekeeperEnabled: boolean;
  /* 08 */ endDateEnabled: boolean;
  /* 09 */ allowListEnabled: boolean;
  /* 10 */ mintLimitEnabled: boolean;
  /* 11 */ nftPaymentEnabled: boolean;
  /* 12 */ redeemedAmountEnabled: boolean;
  /* 13 */ addressGateEnabled: boolean;
};

const GUARDS_SIZE = {
  /* 01 */ botTax: 9,
  /* 02 */ lamports: 40,
  /* 03 */ splToken: 72,
  /* 04 */ startDate: 8,
  /* 05 */ thirdPartySigner: 32,
  /* 06 */ tokenGate: 33,
  /* 07 */ gatekeeper: 33,
  /* 08 */ endDate: 8,
  /* 09 */ allowList: 32,
  /* 10 */ mintLimit: 3,
  /* 11 */ nftPayment: 33,
  /* 12 */ redeemedAmount: 8,
  /* 13 */ addressGate: 32,
};
const GUARDS_COUNT = 11;
const MAX_LABEL_LENGTH = 6;

function determineGuards(buffer: Buffer): Guards {
  const enabled = new BN(beet.u64.read(buffer, 0)).toNumber();

  const guards: boolean[] = [];
  for (let i = 0; i < GUARDS_COUNT; i++) {
    guards.push(!!((1 << i) & enabled));
  }

  const [
    botTaxEnabled,
    lamportsEnabled,
    splTokenEnabled,
    startDateEnabled,
    thirdPartySignerEnabled,
    tokenGateEnabled,
    gatekeeperEnabled,
    endDateEnabled,
    allowListEnabled,
    mintLimitEnabled,
    nftPaymentEnabled,
    redeemedAmountEnabled,
    addressGateEnabled,
  ] = guards;

  return {
    botTaxEnabled,
    lamportsEnabled,
    splTokenEnabled,
    startDateEnabled,
    thirdPartySignerEnabled,
    tokenGateEnabled,
    gatekeeperEnabled,
    endDateEnabled,
    allowListEnabled,
    mintLimitEnabled,
    nftPaymentEnabled,
    redeemedAmountEnabled,
    addressGateEnabled,
  };
}

export function parseData(buffer: Buffer): CandyGuardData {
  // parses the default guard set
  const { guardSet: defaultSet, offset } = parseGuardSet(buffer);
  // retrieves the number of groups
  const groupsCount = new BN(beet.u32.read(buffer, offset)).toNumber();
  const groups: Group[] = [];

  let cursor = beet.u32.byteSize + offset;
  for (let i = 0; i < groupsCount; i++) {
    // parses each individual group
    const label = buffer.subarray(cursor, cursor + MAX_LABEL_LENGTH).toString();
    cursor += MAX_LABEL_LENGTH;
    const { guardSet: guards, offset } = parseGuardSet(buffer.subarray(cursor));
    groups.push({ label, guards });
    cursor += offset;
  }

  return {
    default: defaultSet,
    groups: groups.length === 0 ? null : groups,
  };
}

function parseGuardSet(buffer: Buffer): { guardSet: GuardSet; offset: number } {
  const guards = determineGuards(buffer);
  const {
    botTaxEnabled,
    startDateEnabled,
    lamportsEnabled,
    splTokenEnabled,
    thirdPartySignerEnabled,
    tokenGateEnabled,
    gatekeeperEnabled,
    endDateEnabled,
    allowListEnabled,
    mintLimitEnabled,
    nftPaymentEnabled,
    redeemedAmountEnabled,
    addressGateEnabled,
  } = guards;
  logDebug('Guards: %O', guards);

  // data offset for deserialization (skip u64 features flag)
  let cursor = beet.u64.byteSize;
  // deserialized guards
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {};

  if (botTaxEnabled) {
    const [botTax] = botTaxBeet.deserialize(buffer, cursor);
    data.botTax = botTax;
    cursor += GUARDS_SIZE.botTax;
  }

  if (lamportsEnabled) {
    const [lamports] = lamportsBeet.deserialize(buffer, cursor);
    data.lamports = lamports;
    cursor += GUARDS_SIZE.lamports;
  }

  if (splTokenEnabled) {
    const [splToken] = splTokenBeet.deserialize(buffer, cursor);
    data.splToken = splToken;
    cursor += GUARDS_SIZE.splToken;
  }

  if (startDateEnabled) {
    const [startDate] = startDateBeet.deserialize(buffer, cursor);
    data.startDate = startDate;
    cursor += GUARDS_SIZE.startDate;
  }

  if (thirdPartySignerEnabled) {
    const [thirdPartySigner] = thirdPartySignerBeet.deserialize(buffer, cursor);
    data.thirdPartySigner = thirdPartySigner;
    cursor += GUARDS_SIZE.thirdPartySigner;
  }

  if (tokenGateEnabled) {
    const [tokenGate] = tokenGateBeet.deserialize(buffer, cursor);
    data.tokenGate = tokenGate;
    cursor += GUARDS_SIZE.tokenGate;
  }

  if (gatekeeperEnabled) {
    const [gatekeeper] = gatekeeperBeet.deserialize(buffer, cursor);
    data.gatekeeper = gatekeeper;
    cursor += GUARDS_SIZE.gatekeeper;
  }

  if (endDateEnabled) {
    const [endDate] = endDateBeet.deserialize(buffer, cursor);
    data.endDate = endDate;
    cursor += GUARDS_SIZE.endDate;
  }

  if (allowListEnabled) {
    const [allowList] = allowListBeet.deserialize(buffer, cursor);
    data.allowList = allowList;
    cursor += GUARDS_SIZE.allowList;
  }

  if (mintLimitEnabled) {
    const [mintLimit] = mintLimitBeet.deserialize(buffer, cursor);
    data.mintLimit = mintLimit;
    cursor += GUARDS_SIZE.mintLimit;
  }

  if (nftPaymentEnabled) {
    const [nftPayment] = nftPaymentBeet.deserialize(buffer, cursor);
    data.nftPayment = nftPayment;
    cursor += GUARDS_SIZE.nftPayment;
  }

  if (redeemedAmountEnabled) {
    const [redeemedAmount] = redemeedAmountBeet.deserialize(buffer, cursor);
    data.redeemedAmount = redeemedAmount;
    cursor += GUARDS_SIZE.redeemedAmount;
  }

  if (addressGateEnabled) {
    const [addressGate] = addressGateBeet.deserialize(buffer, cursor);
    data.addressGate = addressGate;
    cursor += GUARDS_SIZE.addressGate;
  }

  return {
    guardSet: {
      botTax: data.botTax ?? null,
      startDate: data.startDate ?? null,
      lamports: data.lamports ?? null,
      splToken: data.splToken ?? null,
      thirdPartySigner: data.thirdPartySigner ?? null,
      tokenGate: data.tokenGate ?? null,
      gatekeeper: data.gateKeeper ?? null,
      endDate: data.endDate ?? null,
      allowList: data.allowList ?? null,
      mintLimit: data.mintLimit ?? null,
      nftPayment: data.nftPayment ?? null,
      redemeedAmount: data.redeemedAmount ?? null,
      addressGate: data.addressGate ?? null,
    },
    offset: cursor,
  };
}
