# SchnellJS

SchnellJS is a TypeScript library for working with the FMUS file format, a new and evolving format i used personally. This library provides utilities for reading, writing, and manipulating FMUS files.

## Installation

(Not published yet)

To install SchnellJS, run the following command:

```
npm install schnelljs
```

## Usage

Here is an example of how to use SchnellJS to read an FMUS file:

```typescript
import { FMUS } from 'schnelljs';

const fmus = new FMUS('example.fmus');

// Access properties of the FMUS file
console.log(fmus.header.version);

// Iterate over elements in the FMUS file
for (const element of fmus.elements) {
  console.log(element.type, element.data);
}
```

## API

### FMUS(file: string)

Creates a new FMUS object for the given file.

#### Properties

- `header`: The header of the FMUS file.
- `elements`: An array of elements in the FMUS file.

### FMUS.write(file: string)

Writes the FMUS object to the given file.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
