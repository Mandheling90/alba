import * as React from 'react';
import { GridEventPublisher, GridEventListener, GridEvents } from '../events';
import { EventManager, EventListenerOptions } from '../../utils/EventManager';
import { GridApiCaches } from '../gridApiCaches';
import type { GridApiCommon, GridPrivateApiCommon } from './gridApiCommon';
/**
 * The core API interface that is available in the grid `apiRef`.
 */
export interface GridCoreApi {
    /**
     * The React ref of the grid root container div element.
     * @ignore - do not document.
     */
    rootElementRef?: React.RefObject<HTMLDivElement>;
    /**
     * Registers a handler for an event.
     * @param {string} event The name of the event.
     * @param {function} handler The handler to be called.
     * @param {object} options Additional options for this listener.
     * @returns {function} A function to unsubscribe from this event.
     */
    subscribeEvent: <E extends GridEvents>(event: E, handler: GridEventListener<E>, options?: EventListenerOptions) => () => void;
    /**
     * Emits an event.
     * @param {GridEvents} name The name of the event.
     * @param {any} params Arguments to be passed to the handlers.
     * @param {MuiEvent<MuiBaseEvent>} event The event object to pass forward.
     */
    publishEvent: GridEventPublisher;
    /**
     * Unique identifier for each component instance in a page.
     * @ignore - do not document.
     */
    instanceId: number;
}
export interface GridCorePrivateApi<GridPublicApi extends GridApiCommon, GridPrivateApi extends GridPrivateApiCommon> {
    /**
     * The caches used by hooks and state initializers.
     */
    caches: GridApiCaches;
    /**
     * Registers a method on the public or private API.
     * @param {'public' | 'private'} visibility The visibility of the methods.
     * @param {Partial<GridApiRef>} methods The methods to register.
     */
    /**
     * The generic event emitter manager.
     */
    eventManager: EventManager;
    /**
     * The React ref of the grid virtual scroller container element.
     */
    virtualScrollerRef?: React.RefObject<HTMLDivElement>;
    register: <V extends 'public' | 'private', T extends V extends 'public' ? Partial<GridPublicApi> : Partial<Omit<GridPrivateApi, keyof GridPublicApi>>>(visibility: V, methods: T) => void;
    /**
     * Returns the public API.
     * Can be useful on a feature hook if we want to pass the `apiRef` to a callback.
     * Do not use it to access the public method in private parts of the codebase.
     * @returns {GridPublicApi} The public api.
     */
    getPublicApi: () => GridPublicApi;
    /**
     * The React ref of the grid column container virtualized div element.
     */
    columnHeadersContainerElementRef?: React.RefObject<HTMLDivElement>;
    /**
     * The React ref of the grid column headers container element.
     */
    columnHeadersElementRef?: React.RefObject<HTMLDivElement>;
}
