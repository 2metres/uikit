@gov.au/animate
============

> A JavaScript function to open, close and toggle the display of page elements.


## Contents

* [Install](#install)
* [API](#api)
* [Dependency graph](#dependency-graph)
* [Build](#build)
* [Tests](#tests)
* [Release History](#release-history)
* [License](#license)


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Install


```shell
yarn add @gov.au/animate
```

```shell
npm install @gov.au/animate --save-dev
```


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## API


Animate has 3 functions:

- [`UIKIT.animate.Run( options )`](#run)
- [`UIKIT.animate.Stop( options )`](#stop)
- [`UIKIT.animate.Toggle( options )`](#toggle)

### Run

`UIKIT.animate.Run( options )`

The options settings are:

`element` - DOM node/s you want to animate  
`property` - CSS property you want to animate (optional, defaults to `height`)  
`endSize` - 'auto' or pixel size of the property after the animation has finished (optional)  
`speed` - animation speed in milliseconds (optional, defaults to `250ms`)  
`callback` - callback function to run when the animation completes (optional)

Example:

```js
UIKIT.animate.Run(
	element: document.getElementById('elementId'),
	property: 'height',
	endSize: 'auto',
	speed: 1000,
	callback: myFunction,
)
```

### Stop

`UIKIT.animate.Stop( options )`

The options settings are:

`element` - DOM node you want to stop animating (this can only be a single element)

Example:

```js
UIKIT.animate.Stop(
	element: document.getElementById('elementId'),
)
```

### Toggle

`UIKIT.animate.Toggle( options )`

The options settings are:

`element` - DOM node/s you want to animate  
`property` - CSS property you want to animate (optional, defaults to `height`)  
`openSize` - pixel size of the property when the element is open (optional, defaults to `auto`)  
`closeSize` - pixel size of the property when the element is closed (optional, defaults to `0`)  
`speed` - animation speed in milliseconds (optional, defaults to `250ms`)  
`callback` - callback function to run when the animation completes (optional)

Example:

```js
UIKIT.animate.Toggle(
	element: document.getElementById('elementId'),
	property: 'height',
	closeSize: 0,
	openSize: 'auto',
	speed: 1000,
	callback: myFunction,
)
```


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------



## Dependency graph

```shell
animate
└─ core
```


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Build


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Tests

The visual test: http://uikit.apps.staging.digital.gov.au/packages/animate/tests/site/


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Release History

* v0.1.0 - 💥 Initial version


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## License

Copyright (c) Commonwealth of Australia.
Licensed under [MIT](https://raw.githubusercontent.com/govau/uikit/packages/core/master/LICENSE).


**[⬆ back to top](#contents)**

# };
