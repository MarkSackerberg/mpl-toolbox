/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  ClusterFilter,
  Context,
  Program,
  PublicKey,
  publicKey,
} from '@metaplex-foundation/umi';
import {
  getMplTokenExtrasErrorFromCode,
  getMplTokenExtrasErrorFromName,
} from '../errors';

export const MPL_TOKEN_EXTRAS_PROGRAM_ID = publicKey(
  'TokExjvjJmhKaRBShsBAsbSvEWMA1AgUNK7ps4SAc2p'
);

export function createMplTokenExtrasProgram(): Program {
  return {
    name: 'mplTokenExtras',
    publicKey: MPL_TOKEN_EXTRAS_PROGRAM_ID,
    getErrorFromCode(code: number, cause?: Error) {
      return getMplTokenExtrasErrorFromCode(code, this, cause);
    },
    getErrorFromName(name: string, cause?: Error) {
      return getMplTokenExtrasErrorFromName(name, this, cause);
    },
    isOnCluster() {
      return true;
    },
  };
}

export function getMplTokenExtrasProgram<T extends Program = Program>(
  context: Pick<Context, 'programs'>,
  clusterFilter?: ClusterFilter
): T {
  return context.programs.get<T>('mplTokenExtras', clusterFilter);
}

export function getMplTokenExtrasProgramId(
  context: Pick<Context, 'programs'>,
  clusterFilter?: ClusterFilter
): PublicKey {
  return context.programs.getPublicKey(
    'mplTokenExtras',
    MPL_TOKEN_EXTRAS_PROGRAM_ID,
    clusterFilter
  );
}
