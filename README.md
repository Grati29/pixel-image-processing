# pixel-image-processing: JavaScript
## Application Description

The project is a web application that interacts with the "Dog CEO's Dog API" to fetch random dog images. The application displays the image in an HTML canvas element and provides the user with the ability to apply various image processing effects. The processing is performed using low-level algorithms to demonstrate a fundamental understanding of image data manipulation, without relying on high-level external libraries or built-in methods.

Users can choose from the following two image processing options, after which four additional image processing methods are called:

- **Mirror Effect**: Reverses the image pixels so that the right side of the image becomes the left side and vice versa.
- **Half Image Processing**: Applies the initial processing (contrast modification) only to the left half of the image, leaving the other half untouched.

The application is designed to run processing asynchronously, breaking the action into four separate execution phases with a one-second delay between them, allowing users to observe each stage of the image transformation. The execution time for each processing step is recorded and displayed in the console, providing transparent insight into the application's performance.

## Project Overview

The project focuses on image manipulation using modern web technologies, with the HTML `<canvas>` element at its core. This element allows for drawing and processing images within a 2D graphic environment. JavaScript, through the 2D context for `<canvas>`, provides methods like `getImageData` and `putImageData`, which are essential for reading and writing image pixels. The image processing involves pixel-level algorithms to perform transformations such as mirror effect, half-image processing, grayscale conversion, and color inversion (negative effect).

## Implementation Overview

The application's implementation is divided into several key JavaScript functions, each handling different aspects of processing:

- **fetchDogImage**: An asynchronous function that queries the Dog CEO API to retrieve JSON data, including a URL for a dog image. Once received, the data is passed to other functions for display and further processing.
- **displayJsonComponents**: Displays JSON components in a dedicated div on the webpage, providing transparency and aiding in debugging.
- **prepareImageProcessing**: Initializes and loads the image into the `<canvas>` element, preparing it for processing.
- **processImage**: Manages the sequence of image processing, triggering the first phase and scheduling subsequent phases.
- **Processing Functions (processImagePhase1, processImagePhase2, etc.)**: A series of functions that apply various image processing effects.

  
## Source Code Comments

Each function and significant code block in `script.js` is accompanied by explanatory comments to clarify the purpose and logic of the implementation.


