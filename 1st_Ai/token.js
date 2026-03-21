import { Tiktoken } from "js-tiktoken/lite";
import o200k_base from "js-tiktoken/ranks/o200k_base"; //this teh model that we will use for tokenization

const enc = new Tiktoken(o200k_base); //this is the tokenizer to encode

const query = "Hello, how are you?";
const tokens = enc.encode(query);
console.log(tokens);

const input = [13225, 11, 1495, 553, 481, 30];
const decode = enc.decode(input);
console.log(decode);

//input embedding --> semantic meanning sand seach similarities
