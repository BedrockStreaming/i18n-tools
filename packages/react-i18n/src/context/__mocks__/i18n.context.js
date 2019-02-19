const Provider = jest.fn(x => x);
Provider.displayName = 'Provider';

const Consumer = jest.fn(({ children}) => children(jest.fn(x => x)));
Consumer.displayName = 'Consumer';

export const Context = { Provider, Consumer };
