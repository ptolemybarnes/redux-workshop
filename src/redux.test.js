import createStore from './createStore';

test('holds the initial state', () => {
  const initialState = { foo: 'bar' };
  const store = createStore(
    () => {}, // this is the 'reducer' // dw about it for this test.
    initialState
  );

  expect(store.getState()).toEqual(initialState);
});

test.skip('updating state via an action', () => {
  const reducer = (prevState, event) => {
    if (event.type === 'NEW_USER') {
      return { count: prevState.count + 1 }
    }
  };
  const store = createStore(
    reducer,
    { count: 0 }
  );

  store.dispatch({ type: 'NEW_USER' });

  expect(store.getState()).toEqual({ count: 1 });
});

test.skip('the new state is merged into the old state', () => {
  const reducer = (prevState, event) => {
    if (event.type === 'NEW_USER') {
      return { count: prevState.count + 1 }
    }
  };
  const store = createStore(
    reducer,
    { count: 0, foo: 'bar' }
  );

  store.dispatch({ type: 'NEW_USER' });

  expect(store.getState()).toEqual({ count: 1, foo: 'bar' });
});

test.skip('dispatching an action with a payload', () => {
  const reducer = (prevState, event) => {
    if (event.type === 'NEW_USER') {
      return { count: prevState.count + 1, username: event.username }
    }
  };
  const store = createStore(reducer, { count: 0 });

  store.dispatch({ type: 'NEW_USER',  username: 'Rufus Sixsmith' });

  expect(store.getState()).toEqual({ count: 1, username: 'Rufus Sixsmith' });
});

test.skip('listening to changes on the store', () => {
  const reducer = (prevState, event) => {
    if (event.type === 'NEW_USER') {
      return { count: prevState.count + 1, username: event.username }
    }
  };
  const store = createStore(reducer, { count: 0 });

  const listener = jest.fn();
  store.subscribe(listener);

  store.dispatch({ type: 'NEW_USER',  username: 'Rufus Sixsmith' });

  expect(listener).toHaveBeenCalledWith({ count: 1, username: 'Rufus Sixsmith' });
});

test.skip('multiple listeners', () => {
  const reducer = (prevState, event) => {
    if (event.type === 'NEW_USER') {
      return { count: prevState.count + 1, username: event.username }
    }
  };
  const store = createStore(reducer, { count: 0 });

  const listener = jest.fn();
  const listener2 = jest.fn();
  store.subscribe(listener);
  store.subscribe(listener2);

  store.dispatch({ type: 'NEW_USER',  username: 'Rufus Sixsmith' });

  expect(listener).toHaveBeenCalledWith({ count: 1, username: 'Rufus Sixsmith' });
  expect(listener2).toHaveBeenCalledWith({ count: 1, username: 'Rufus Sixsmith' });
});

test.skip('merging existing state into new state', () => {
  const newUserReducer = (prevState, event) => {
    if (event.type === 'NEW_USER') {
      return { count: prevState.count + 1 }
    }
    return prevState;
  };
  const newBlogReducer = (prevState, event) => {
    if (event.type === 'NEW_BLOG') {
      return { blogs: [ ...prevState.blogs, event.blog ] }
    }
    return prevState;
  };
  const reducer = composeReducers([newUserReducer, newBlogReducer])
  const store = createStore(reducer, { count: 0, blogs: ['My Blog']});

  store.dispatch({ type: 'NEW_USER' });
  store.dispatch({ type: 'NEW_BLOG',  blog: 'Cats' });

  expect(store.getState()).toEqual({ count: 1, blogs: ['My Blog', 'Cats' ] });
});
