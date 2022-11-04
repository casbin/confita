/**
 * 
 * @param {any} obj 
 * @returns {obj is string}
 */
export const isString = obj => typeof obj === "string";

/**
 * 
 * @param {string | import('./Setting').CodeTag} tag
 * @returns {import("./Setting").CodeTag}
 */
export const mapStringToTag = tag => isString(tag) ? {label: tag, filter: code => code.tags.find(codeTag => codeTag === tag)} : tag;
