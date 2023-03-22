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
	// console.log('event', _opts.resHeaders);
	// const user = getUser();
	// return {
	// 	session: {
	// 		user,
	// 	},
	// };

	console.log('HEADERs', _opts.resHeaders);

	return {
		session,
		..._opts,
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
