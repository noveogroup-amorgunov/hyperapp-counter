import {app} from 'hyperapp';
import type {Action, Subscription, VNode, Effect} from 'hyperapp';
import {h} from '~/src/h';

type State = {
    counter: number;
};

const initialState: State = {
    counter: 0,
};

const add: Action<State> = state => ({...state, counter: state.counter + 1});
const subract: Action<State> = state => ({...state, counter: state.counter - 1});

const keyDownSubscription: Subscription<State> = [
    (dispatch, {onup, ondown}) => {
        let handler = (event: KeyboardEvent) => {
            if (event.key === 'ArrowUp') {
                dispatch(onup);
            } else if (event.key === 'ArrowDown') {
                dispatch(ondown);
            }
        };

        window.addEventListener('keydown', handler);

        return () => window.removeEventListener('keydown', handler);
    },
    {onup: add, ondown: subract},
];

const addAsyncEffect: Effect<State> = [
    dispatch => {
        setTimeout(() => {
            dispatch(add);
        }, 1000);
    },
    null,
];

const addAsync: Action<State> = state => [state, addAsyncEffect];

function View(state: State): VNode<State> {
    return (
        <main>
            <h1>state.counter: {state.counter}</h1>
            <Button onclick={add}>Add</Button>
            <Button onclick={addAsync}>Add async</Button>
            <Button onclick={subract}>Subtract</Button>
        </main>
    );
}

type ButtonProps = {
    onclick: Action<State>;
};

function Button(props: ButtonProps, children: VNode<unknown>) {
    const {onclick} = props;

    return <button onclick={onclick}>{children}</button>;
}

app<State>({
    init: initialState,
    view: View,
    subscriptions: () => [keyDownSubscription],
    node: document.querySelector('#app')!,
});
