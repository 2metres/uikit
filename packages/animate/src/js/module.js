/***************************************************************************************************************************************************************
 *
 * Animate function
 *
 * A function to open, close and toggle the display of page elements.
 *
 **************************************************************************************************************************************************************/

var UIKIT = UIKIT || {};

( function( UIKIT ) {

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// NAMESPACE MODULE
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	var animate = {}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// PRIVATE FUNCTIONS
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 * Calculate the requirements for the desired animation
	 *
	 * @param  {integer} initalSize - The initial size of the element to animate
	 * @param  {string}  speed      - The speed of the animation in ms
	 * @param  {integer} endSize    - The size the element after the animation completes
	 *
	 * @return {object}             - Required steps, stepSize and intervalTime for the animation
	 */
	function CalculateAnimationSpecs( initialSize, endSize, speed ) {
		var distance = endSize - initialSize;         // the overall distance the animation needs to travel
		var intervalTime = ( speed / distance );      // the time each setInterval iteration will take
		var stepSize = distance < 0 ? -1 : 1;         // if distance is negative then we set stepSize to -1
		var steps = Math.abs( distance / stepSize );  // the amount of steps required to achieve animation
		intervalTime = speed / steps;

		// we need to adjust our animation specs if interval time exceeds 60FPS eg intervalTime < 16.67ms
		if( Math.abs( intervalTime ) < ( 50 / 3 ) ) {
			stepSize = Math.round( ( 50 / 3 ) / intervalTime );
			steps = Math.abs( Math.floor( distance / stepSize ) );
			stepSize = distance < 0 ? -stepSize : stepSize;
			intervalTime = speed / steps;
		}

		return {
			stepSize: stepSize,
			steps: ( steps - 1 ), //TODO small distance with long time
			intervalTime: intervalTime,
		};
	}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// PUBLIC FUNCTIONS
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
	/**
	 * Calculate the size of the element when it’s dimension(height or width) is set to auto
	 *
	 * @param  {object} element   - The element to read auto height from
	 * @param  {string} dimension - The dimension to measure
	 *
	 * @return {integer}          - The size of the element when at dimension(height or width) is set to 'auto'
	 */
	animate.CalculateAuto = function( element, dimension ) {
		var initialSize;
		var endSize;

		if( dimension === 'height' ) {
			initialSize = element.clientHeight;       // get current height
			element.style[ dimension ] = 'auto';      // set height to auto
			endSize = element.clientHeight;           // get height again
			element.style[ dimension ] = initialSize; // set back to initial height
		}
		else {
			initialSize = element.clientWidth;
			element.style[ dimension ] = 'auto';
			endSize = element.clientWidth;
			element.style[ dimension ] = initialSize;
		}

		return parseInt( endSize );
	}


	/**
	 * Stop any uikit animation on a DOM element
	 *
	 * @param  {object} element - The element to stop animating
	 */
	animate.Stop = function ( element ) {
		clearInterval( element.UIKITanimation );
	}


	/**
	 * The magical animation function
	 *
	 * @param  {object}   element  - Element/s we are animating
	 * @param  {string}   property - The property to animate
	 * @param  {integer}  endSize  - The size the element should animate to
	 * @param  {integer}  speed    - The speed of the animation
	 * @param  {function} callback - A function to be executed after the animation ends
	 *
	 * @return {unknown}           - The return passed on from our callback function [optional]
	 */
	animate.Run = function( options ) {
		// defaults
		var elements = options.element;
		var speed = options.speed || 250;

		// making a single DOM element iteratable
		if( elements.length === undefined ) {
			elements = [ elements ];
		}

		// making a callback if none was provided
		if( typeof options.callback !== 'function' ) {
			options.callback = function() {};
		}

		// adding iteration counts
		elements[ 0 ].UIKITinteration = 0;
		elements[ 0 ].UIKITinterations = elements.length;

		// iterate over all DOM nodes
		for( var i = 0; i < elements.length; i++ ) {
			var element = elements[ i ];                                                         // this element
			UIKIT.animate.Stop( element );                                                       // stop any previous animations
			var initialSize = parseInt( window.getComputedStyle( element )[ options.property ] ) // the elements current size
			// TODO element.currentStyle for IE?

			var endSize = options.endSize;                                                       // the element end size

			if( options.endSize === 'auto' ) {                                                   // calculate what 'auto' means in pixel
				endSize = UIKIT.animate.CalculateAuto( element, options.property );
			}

			// calculate our animation specs
			var animationSpecs = CalculateAnimationSpecs( initialSize, endSize, speed );
			// var steps = Math.abs( animationSpecs.steps );
			var iterateCounter = initialSize;

			// set state
			if( animationSpecs.stepSize < 0 ) {
				element.UIKITtoggleState = 'closing'
			}
			else if( animationSpecs.stepSize > 0 ) {
				element.UIKITtoggleState = 'opening'
			}
			else {
				throw new Error('UIKIT.animate.Run cannot determine state of element');
			}

			// keep track of animation by adding it to the DOM element
			element.UIKITanimation = setInterval( function() {
				iterateCounter += animationSpecs.stepSize;
				element.style[ options.property ] = iterateCounter + 'px';

				// when we are at the end
				if( initialSize === endSize || animationSpecs.steps === 0 ) {
					UIKIT.animate.Stop( element );

					element.style[ options.property ] = endSize + 'px'; //set to endSize
					element.UIKITtoggleState = '';

					elements[ 0 ].UIKITinteration ++;

					// removing auto so CSS can take over
					if( options.endSize === 'auto' ) {
						element.style[ options.property ] = '';
					}

					// when all iterations have finished, run the callback
					if( elements[ 0 ].UIKITinteration >= elements[ 0 ].UIKITinterations ) {
						return options.callback();
					}
				}

				// if we are still animating
				else {
					animationSpecs.steps --;
				}

			}, Math.abs( animationSpecs.intervalTime ) );
		}
	};


	/**
	 * Toggle animation
	 *
	 * @param  {object}   el          - The element to animate
	 * @param  {string}   closeSize   - The direction of the animation (either height or width)
	 * @param  {string}   dimension   - The dimension the animation moves in (either height or width)
	 * @param  {integer}  speed      - The speed of the animation in ms
	 * @param  {function} callback  - The callback to run after the animation has completed
	 *
	 */
	animate.Toggle = function( options ) {

		var elements = options.element;
		var property = options.property || 'height';
		var speed = options.speed || 250;
		var closeSize = options.closeSize || 0;
		var openSize = options.openSize || 'auto'

		// making a single DOM element iteratable
		if( elements.length === undefined ) {
			elements = [ elements ];
		}

		// making a callback if none was provided
		if( typeof options.callback !== 'function' ) {
			options.callback = function() {};
		}

		// iterate over all DOM nodes
		for( var i = 0; i < elements.length; i++ ) {
			var element = elements[ i ];

			UIKIT.animate.Stop( element );

			var targetSize;                                                           // the size the element should open/close to after toggle is clicked
			var currentSize = parseInt( window.getComputedStyle( element )[ options.property ] ); // the current size of the element

			if( currentSize === closeSize || element.UIKITtoggleState === 'closing' ) {
				targetSize = openSize;
			}
			else if( currentSize !== closeSize || element.UIKITtoggleState === 'opening' ) {
				targetSize = closeSize;
			}
			else {
				throw new Error('UIKIT.animate.Toggle cannot determine state of element');
			}

			// shoot off animation
			UIKIT.animate.Run({
				element: element,
				endSize: targetSize,
				property: property,
				speed: speed,
				callback: options.callback,
			});

		}
	};


	UIKIT.animate = animate;

}( UIKIT ));
