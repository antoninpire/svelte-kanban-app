import type { inferAsyncReturnType } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

type Session = Readonly<{
	sessionId: string;
	userId: string;
	activePeriodExpires: Date;
	idlePeriodExpires: Date;
	state: 'idle' | 'active';
	isFresh: boolean;
}> | null;

export async function createContext(
	_opts: FetchCreateContextFnOptions,
	session: Session
) {
	return {
		session,
		..._opts,
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
