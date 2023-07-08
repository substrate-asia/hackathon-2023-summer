// import RWLock from 'rwlock';

// export class EventManager {
// 	private static _instance: EventManager;
// 	private readonly _subscriptionEventMap: Map<string, SubscribableContractEvent[]>;
// 	private readonly _subscriptionMap: Map<string, Subscription>;
// 	private readonly _lock;

// 	public get subscriptions() {
// 		return this._subscriptionMap;
// 	}

// 	private constructor() {
// 		this._subscriptionEventMap = new Map<string, SubscribableContractEvent[]>();
// 		this._subscriptionMap = new Map<string, Subscription>();
// 		this._lock = new RWLock();
// 	}

// 	static getInstance() {
// 		if (!this._instance) {
// 			this._instance = new EventManager();
// 		}
// 		return this._instance;
// 	}

// 	addSubscription(subscription: Subscription) {
// 		this._lock.readLock('read lock', (release) => {
// 			if (!this._subscriptionEventMap.has(subscription.toMapKey())) {
// 				this._lock.writeLock('write lock', (release) => {
// 					this._subscriptionEventMap.set(subscription.toMapKey(), []);
// 					this._subscriptionMap.set(subscription.toMapKey(), subscription);
// 					release();
// 				});
// 			}
// 			release();
// 		});
// 	}

// 	removeSubscription(subscription: Subscription) {
// 		this._lock.readLock('read lock', (release) => {
// 			if (this._subscriptionEventMap.has(subscription.toMapKey())) {
// 				this._lock.writeLock('write lock', (release) => {
// 					this._subscriptionEventMap.delete(subscription.toMapKey());
// 					this._subscriptionMap.delete(subscription.toMapKey());
// 					release();
// 				});
// 			}
// 			release();
// 		});
// 	}

// 	addEventToSubscription(subscription: Subscription, event: SubscribableContractEvent) {
// 		this._lock.readLock('read lock', (release) => {
// 			const eventsInSubscription = this._subscriptionEventMap.get(subscription.toMapKey());
// 			if (eventsInSubscription) {
// 				this._lock.writeLock('write lock', (release) => {
// 					eventsInSubscription.push(event);
// 					release();
// 				});
// 			}
// 			release();
// 		});
// 	}

// 	releaseEventsFromSubscription(subscription: Subscription): SubscribableContractEvent[] {
// 		let eventsInSubscription: SubscribableContractEvent[] = [];

// 		this._lock.readLock('read lock', (release) => {
// 			// Take out the existing events of this subscription
// 			eventsInSubscription = this._subscriptionEventMap.get(subscription.toMapKey()) ?? [];

// 			// Clear the event list of the subscription entry in the map
// 			if (eventsInSubscription && eventsInSubscription.length > 0) {
// 				this._lock.writeLock('write lock', (release) => {
// 					this._subscriptionEventMap.set(subscription.toMapKey(), []);
// 					release();
// 				});
// 			}
// 			release();
// 		});

// 		return eventsInSubscription;
// 	}

// 	hasSubscription(event: Subscription): boolean {
// 		return this._subscriptionEventMap.has(event.toMapKey());
// 	}

// 	getSubscriptions(): IterableIterator<Subscription> {
// 		return this._subscriptionMap.values();
// 	}

// }

// export class Subscription {
// 	private _mapKey: string;

// 	constructor(public readonly contractAddress: string, public readonly eventId: string) {
// 		this._mapKey = JSON.stringify(this);
// 	}

// 	public toMapKey(): string {
// 		return this._mapKey;
// 	}

// 	public static fromMapKey(mapKey: string) {
// 		if (Subscription.isEmpty(mapKey)) {
// 			throw new Error('Cannot create a `Subscription` instance with a blank string.');
// 		}

// 		return JSON.parse(mapKey) as Subscription;
// 	}

// 	private static isEmpty(str: string) {
// 		return str === null || typeof str === 'undefined' || str === '' || str.trim() === '';
// 	}
// }

// This is the model for a custom contract event
export class SubscribableContractEvent {
	constructor(public eventId: string, public message: string) { }
}

// This is defined to collect a custom contract event decoded from a SCALE encoded binary
export const subscribableContractEventForTypes = {
	SubscribableContractEvent: {
		padding: 'String', // Unknown padding in the beginning of the decoded struct
		eventId: 'String',
		message: 'String',
	}
};
