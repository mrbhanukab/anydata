import StructuredData from "./StructuredData.js";
import { PathLike } from "fs";
import { autoParser } from "./utils/autoParser.js";
import { FileHandle } from "fs/promises";

/**
 * Module for automatic format detection and parsing
 */

const parser = new autoParser();

const parse = {
      /**
     * Parse data from a string, automatically detecting its format
     * @param text The text to parse
     * @returns StructuredData object with parsed content
     */
    from(text: string): StructuredData {
        return parser.parseData(text);
    },
    
    /**
     * Load a file and parse its content, automatically detecting its format
     * @param path Path to the file
     * @returns Promise resolving to StructuredData object
     */
    async loadFile(path: PathLike | FileHandle): Promise<StructuredData> {
        return parser.parseData(path);
    }
};
export default parse;