export const Provider = jest.fn(x => x);
Provider.displayName = 'Provider';

export const Consumer = jest.fn(({ children}) => children(jest.fn(x => x)));
Consumer.displayName = 'Consumer';
