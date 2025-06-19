import { randomBytes } from 'crypto';

/**
 * Generates a unique file identifier
 * @param {number} [length=16] - Length of the identifier
 * @returns {string} Unique file identifier
 */
export function generateFileIdentifier(length: number = 16): string {
    if (length < 4 || length > 64) {
        throw new Error('File identifier length must be between 4 and 64 characters');
    }

    return randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

/**
 * Validates a file identifier
 * @param {string} identifier - File identifier to validate
 * @returns {boolean} Whether the identifier is valid
 */
export function isValidFileIdentifier(identifier: string): boolean {
    const hexRegex = /^[0-9a-fA-F]+$/;
    return identifier.length >= 4 && 
           identifier.length <= 64 && 
           hexRegex.test(identifier);
}