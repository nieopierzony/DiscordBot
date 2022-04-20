'use strict';

const fs = require('node:fs');
const { svg2png } = require('svg-png-converter');

const letterSvg = fs.readFileSync('./assets/letter.svg', 'utf-8');
const cardSvg = fs.readFileSync('./assets/hangman.svg', 'utf-8');

const TEXT_START_X = 220;
const LETTER_SPACE = 25;

const buildCard = async (word) => {
  let text = '';
  for (const [i, letter] of Object.entries(word.split(''))) {
    text += letterSvg
      .replace('LETTER', letter.toUpperCase())
      .replace('{x}', (TEXT_START_X + LETTER_SPACE * i).toString());
  }
  const rawCard = cardSvg.replace('{text}', text);
  const png = await svg2png({ input: rawCard, encoding: 'buffer', format: 'jpg' });
  fs.writeFileSync('card.jpg', png);
};

const pickRandomWord = ({ categories }) => {
  const enabledCategories = categories.filter((cat) => cat.enabled);
  const flatWords = enabledCategories.map((cat) => cat.words).flat();
  return flatWords[Math.floor(Math.random() * flatWords.length)];
};

const findIndices = (array, element) => {
  const indices = [];
  let idx = array.indexOf(element);
  while (idx !== -1) {
    indices.push(idx);
    idx = array.indexOf(element, idx + 1);
  }
  return indices;
};

const maskWord = (word, answeredLetters = []) => {
  const upperAnsweredLetters = answeredLetters.map((el) => el.toUpperCase());
  const maskedWord = new Array(word.length).fill('*').join('');
  console.log(maskedWord);
  const arrayWord = word.split('');
  for (const letter of upperAnsweredLetters) {
    const indices = findIndices(arrayWord, letter);
    for (const index of indices) maskedWord[index] = letter;
  }
  return maskedWord;
};

module.exports = { buildCard, maskWord, pickRandomWord };
