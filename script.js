'use strict';

const baseUrl = 'https://fe.it-academy.by/Examples/words_tree/';
const fileName = 'root.txt';

const returnData = function (data) {
    if (data.startsWith('[')) {
        const fileNames = JSON.parse(data);
        let result = '';

        const fetchPromises = fileNames.map((fileName) => {
            return fetchDataThen(fileName);
        });
        return Promise.all(fetchPromises)
            .then((fileDataArray) => {
                result = fileDataArray.join(' ');
                return result;
            });
    }
    return data;
}

// 1 method AsyncAwait 
const fetchDataAsyncAwait = async (fileName) => {
    try {
        const url = baseUrl + fileName;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data from ${url}`);
        }
        const data = await response.text();
        return returnData(data)
    } catch (error) {
        console.error(error.message);
        return '';
    }
};

// console results
/*
(async () => {
    try {
        const rootPhrase = await fetchDataAsyncAwait(fileName);
        console.log(`Root phrase using using async/await and arrow function - "${rootPhrase}"`);
    } catch (error) {
        console.error(`Error occurred - "${error.message}"`);
    }
})();
*/

// 2 method Then
function fetchDataThen(fileName) {
    const url = baseUrl + fileName;
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching data from ${url}`);
            }
            return response.text();
        })
        .then(data => returnData(data))
        .catch(error => {
            console.error(error);
            return '';
        });
}

// console results
/*
(function () {
    fetchDataThen(fileName)
        .then(function (rootPhraseThen) {
            console.log(`Root phrase using .then and function declaration - "${rootPhraseThen}"`);
        })
        .catch(function (error) {
            console.error(`Error occurred - "${error.message}"`);
        })
})()
*/

// Logic for modal windows
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const closeModalBtn = document.querySelector('.close-modal');
const openModalBtns = document.querySelectorAll('.show-modal');

const closeModalWindow = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

const openModalWindow = function (resultText) {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    modal.textContent = resultText;
};

for (let i = 0; i < openModalBtns.length; i += 1)
    openModalBtns[i].addEventListener('click', async () => {
        let rootPhrase;
        if (openModalBtns[i].classList.contains('await')) {
            rootPhrase = await fetchDataAsyncAwait(fileName);
        } else if (openModalBtns[i].classList.contains('then')) {
            rootPhrase = await fetchDataThen(fileName)
        }
        openModalWindow(`Root phrase is "${rootPhrase}"`);
    });

closeModalBtn.addEventListener('click', closeModalWindow);

overlay.addEventListener('click', closeModalWindow);

document.addEventListener('keydown', function (event) {
    console.log(event.key);
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModalWindow();
    }
});
