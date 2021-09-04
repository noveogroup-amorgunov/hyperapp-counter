import * as hyperapp from 'hyperapp';
import type {VNode} from 'hyperapp';

declare global {
    namespace JSX {
        type Element = VNode<any>;
        type IntrinsicElements = {
            [elemName: string]: any;
        };
    }
}

type Component<T> = (props: T, children: VNode<any>[]) => VNode<any>;

export const h = (
    tag: string | Component<unknown>,
    props: any,
    ...children: VNode<any>[]
) => {
    if (typeof tag === 'function') {
        return tag(props, children);
    }

    const transformChildren = children.flat().map(any => {
        const isPrimitive = typeof any === 'string' || typeof any === 'number';
        return isPrimitive ? hyperapp.text(any) : any;
    });

    return hyperapp.h(tag, props || {}, transformChildren);
};
