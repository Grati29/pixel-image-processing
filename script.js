// prelucrarea json facuta asincron
async function fetchDogImage(selectedOption) {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();
        displayJsonComponents(data);
        prepareImageProcessing(data.message, selectedOption);
    } catch (error) {
        console.error('Error fetching dog image:', error);
    }
}

function displayJsonComponents(jsonData) {
    const displayDiv = document.getElementById('jsonDisplay');
    displayDiv.textContent = JSON.stringify(jsonData, null, 2);
}

document.getElementById('processButton').addEventListener('click', function() {
    const selectedOption = document.querySelector('input[name="processingOption"]:checked').value;
    fetchDogImage(selectedOption);
});

// incarcarea + prelucrarea imag in canvas
function prepareImageProcessing(imageUrl, selectedOption) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => processImage(img, selectedOption);
    img.src = imageUrl;
}

// functia principala de procesare a imaginii
function processImage(img, selectedOption) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    //aleg ce optiune se aplica in functie de alegerea utilizatorului
    if (selectedOption === 'mirror') {
        applyMirrorEffect(img, ctx);
    } else if (selectedOption === 'half') {
        applyHalfImageProcessing(img, ctx, 2.0);
    }
    //prima faza de procesare dupa o secunda
    setTimeout(() => processImagePhase1(img, ctx), 1000);
    //urmatoarele faze se apeleaza in fiecare functie dupa terminarea fazelor de procesare curente
}

// 4 etape de procesare a imaginii
function processImagePhase1(img, ctx) {
    console.time("Faza de Procesare 1 - Converting Color Image to Gray-Scale Image - Average method");
    // datele imaginii din canvas
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;
    // parcurg fiecare pixel și setez canalele de culoare la valoarea medie
    for (let i = 0; i < data.length; i += 4) {
        // calzulez media canalelor de culoare
        const average = (data[i] + data[i + 1] + data[i + 2]) / 3;
        // setez toate canalele de culoare la media calculată
        data[i] = data[i + 1] = data[i + 2] = average;
    }
    // scriu datele imaginii modificate înapoi în canvas
    ctx.putImageData(imageData, 0, 0);
    console.timeEnd("Faza de Procesare 1 - Converting Color Image to Gray-Scale Image - Average method");
    setTimeout(() => processImagePhase2(img, ctx, 2), 1000); // următoarea fază de procesare după o secundă
}

function processImagePhase2(img, ctx, depth) {
    console.time("Faza de Procesare 2- Decrease color depth Gray-Scale");  
    // obtin datele imaginii din canvas
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;
    // calculez factorul pe baza adâncimii dorite. De exemplu, pentru 4 niveluri de gri, factorul este 255 / (4 - 1)
    const factor = 255 / (Math.pow(2, depth) - 1);
    // parcurg fiecare pixel și îi reduc adâncimea de culoare
    for (let i = 0; i < data.length; i += 4) {
        // calculez luminozitatea pixelului actual
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        // reduc adâncimea de culoare prin rotunjire la cel mai apropiat nivel
        const newGray = Math.round(gray / factor) * factor;
        // setez noul nivel de gri pentru canalele de culoare
        data[i] = data[i + 1] = data[i + 2] = newGray;
    }
    // scriu datele imaginii modificate înapoi în canvas
    ctx.putImageData(imageData, 0, 0);
    console.timeEnd("Faza de Procesare 2- Decrease color depth Gray-Scale");
    setTimeout(() => processImagePhase3(img, ctx), 1000); // a3a fază de procesare după o secundă
}

function processImagePhase3(img, ctx) {
    console.time("Faza de Procesare 3 - Negative Image (inversare de imagine pe ½ atat pe verticala cat si pe orizontala)");
    // obțin datele imaginii din canvas
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;
    // calculez jumătatea lățimii și înălțimii pentru a aplica efectul negativ doar pe jumătate din imagine
    const halfWidth = Math.floor(img.width / 2);
    const halfHeight = Math.floor(img.height / 2);
    // parcurg fiecare pixel și aplic efectul negativ doar pe sfertul superior drept și sfertul inferior stâng al imaginii
    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            if ((x >= halfWidth && y < halfHeight) || (x < halfWidth && y >= halfHeight)) {
                const i = (y * img.width + x) * 4;
                data[i] = 255 - data[i];       // R
                data[i + 1] = 255 - data[i + 1]; // G
                data[i + 2] = 255 - data[i + 2]; // B
            }
        }
    }
    // scriu datele imaginii modificate înapoi în canvas
    ctx.putImageData(imageData, 0, 0);
    console.timeEnd("Faza de Procesare 3 - Negative Image (inversare de imagine pe ½ atat pe verticala cat si pe orizontala)");
    setTimeout(() => processImagePhase4(img, ctx), 1000); // a patra fază de procesare după o secundă
}

function processImagePhase4(img, ctx) {
    console.time("Faza de Procesare 4 - Rotate Image 90");
    // obțin datele imaginii originale
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;
    // creez un nou buffer de imagine pentru datele rotite
    const rotatedData = new Uint8ClampedArray(data.length);
    // calculez noua lățime și înălțime
    const newWidth = img.height;
    const newHeight = img.width;
    // parcurg fiecare pixel și il rearanjez
    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            const oldIndex = (y * img.width + x) * 4;
            const newX = img.height - y - 1;
            const newY = x;
            const newIndex = (newY * newWidth + newX) * 4;
            rotatedData[newIndex] = data[oldIndex];         // R
            rotatedData[newIndex + 1] = data[oldIndex + 1]; // G
            rotatedData[newIndex + 2] = data[oldIndex + 2]; // B
            rotatedData[newIndex + 3] = data[oldIndex + 3]; // A
        }
    }
    // creez o nouă imagine din datele rotite
    const rotatedImageData = new ImageData(rotatedData, newWidth, newHeight);
    // redimensionez canvas-ul pentru a se potrivi cu noua dimensiune a imaginii
    canvas.width = newWidth;
    canvas.height = newHeight;
    // desenez noua imagine rotită pe canvas
    ctx.putImageData(rotatedImageData, 0, 0);
    console.timeEnd("Faza de Procesare 4 - Rotate Image 90");
}

// functia pentru optiunea de aplicare a efectului initial pe jumate de imagine
function applyHalfImageProcessing(img, ctx, contrastFactor) {
    console.time("Procesare jumatate de imagine - Image Contrast modification");
    // obțin datele imaginii din canvas
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;
    const halfWidth = img.width / 2; // Jumătatea lățimii imaginii
    // ajustez contrastul pentru fiecare pixel din jumătatea stângă a imaginii
    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < halfWidth; x++) {
            const i = (y * img.width + x) * 4;
            let red = data[i];
            let green = data[i + 1];
            let blue = data[i + 2];
            // aplic ajustarea contrastului pentru fiecare canal de culoare
            red = (red - 128) * contrastFactor + 128;
            green = (green - 128) * contrastFactor + 128;
            blue = (blue - 128) * contrastFactor + 128;
            // ma asigur că valorile rămân în intervalul [0, 255]
            data[i] = Math.min(255, Math.max(0, red));
            data[i + 1] = Math.min(255, Math.max(0, green));
            data[i + 2] = Math.min(255, Math.max(0, blue));
            // Canalul alpha rămâne neschimbat
        }
    }
    // scriu datele imaginii modificate înapoi în canvas
    ctx.putImageData(imageData, 0, 0);
    console.timeEnd("Procesare jumatate de imagine - Image Contrast modification");
}

// functia pentru optiunea de aplicare a efectului initial de mirror
function applyMirrorEffect(img, ctx) {
    console.time("Mirror Effect (astfel incat pixelii din dreapta sa ajunga in stanga si invers)");
    // lățimea și înălțimea canvas-ului
    const width = img.width;
    const height = img.height;
    // obtin datele imaginii din canvas
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    // parcurg fiecare rând de pixeli din imagine
    for (let y = 0; y < height; y++) {
        // folosesc jumatate din latime pt ca o suprascriu peste cealalta jumatate
        for (let x = 0; x < width / 2; x++) {
            // indexul pixelului curent
            const index = (y * width + x) * 4;
            // indexul pixelului corespondent pe partea opusă
            const mirrorIndex = (y * width + (width - 1 - x)) * 4;
            // Copiez pixelul pe partea opusă
            data[mirrorIndex] = data[index];       // R
            data[mirrorIndex + 1] = data[index + 1]; // G
            data[mirrorIndex + 2] = data[index + 2]; // B
            data[mirrorIndex + 3] = data[index + 3]; // A
        }
    }
    // scriu datele imaginii modificate înapoi în canvas
    ctx.putImageData(imageData, 0, 0);
    console.timeEnd("Mirror Effect (astfel incat pixelii din dreapta sa ajunga in stanga si invers)");
}

