When you get the error `TypeError: window.matchMedia is not a function `, put this in your describe block:

```
beforeAll(() => {
Object.defineProperty(window, 'matchMedia', {
writable: true,
value: jest.fn().mockImplementation((query) => ({
matches: false,
media: query,
onchange: null,
addListener: jest.fn(), // Deprecated
removeListener: jest.fn(), // Deprecated
addEventListener: jest.fn(),
removeEventListener: jest.fn(),
dispatchEvent: jest.fn(),
})),
});
});
```
