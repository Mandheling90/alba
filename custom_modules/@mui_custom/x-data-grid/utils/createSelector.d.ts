import * as React from 'react';
import { Selector, SelectorResultArray } from 'reselect';
type CacheKey = number | string;
export interface OutputSelector<State, Result> {
    (apiRef: React.MutableRefObject<{
        state: State;
        instanceId: number;
    }>): Result;
    (state: State, instanceId?: number): Result;
    acceptsApiRef: boolean;
}
type StateFromSelector<T> = T extends (first: infer F, ...args: any[]) => any ? F extends {
    state: infer F2;
} ? F2 : F : never;
type StateFromSelectorList<Selectors extends readonly any[]> = Selectors extends [
    f: infer F,
    ...rest: infer R
] ? StateFromSelector<F> extends StateFromSelectorList<R> ? StateFromSelector<F> : StateFromSelectorList<R> : {};
type SelectorArgs<Selectors extends ReadonlyArray<Selector<any>>, Result> = [selectors: [...Selectors], combiner: (...args: SelectorResultArray<Selectors>) => Result] | [...Selectors, (...args: SelectorResultArray<Selectors>) => Result];
type CreateSelectorFunction = <Selectors extends ReadonlyArray<Selector<any>>, Result>(...items: SelectorArgs<Selectors, Result>) => OutputSelector<StateFromSelectorList<Selectors>, Result>;
export declare const createSelector: CreateSelectorFunction;
export declare const unstable_resetCreateSelectorCache: (cacheKey?: CacheKey) => void;
export {};
