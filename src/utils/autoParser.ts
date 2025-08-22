import StructuredData from "../StructuredData.js";
import { json, xml, csv, yaml } from "../index.js";
import fs from "fs";
import { PathLike } from "fs";
import { FileHandle } from 'fs/promises';

// Class responsible for detecting and parsing data formats automatically
export class autoParser {

    // Method to detect the format
    private detectFormat(text: string): "json" | "xml" | "csv" | "yaml" | null {
        text = text.trim();

        // Check for JSON - starts with { or [ and ends with } or ]
        if ((text.startsWith("{") && text.endsWith("}")) ||
            (text.startsWith("[") && text.endsWith("]"))) {
            return "json";
        }
        // Check for XML - starts with < and contains closing tags
        else if (text.startsWith("<") &&
            /<\/?[a-zA-Z][\w\-\.]*[^<>]*>/i.test(text)) {
            return "xml";
        }
        // Check for CSV - contains commas or semicolons and multiple lines
        else if (/\n/g.test(text) &&
            /([,;])/g.test(text) &&
            !/[{}[\]<>]/.test(text)) {
            return "csv";
        }
        // Check for YAML - typical YAML patterns
        else if (/^[a-zA-Z0-9_-]+:\s/m.test(text) ||
            /^\s*-\s+[a-zA-Z0-9_-]+/m.test(text)) {
            return "yaml";
        }
        return null;
    }

    // Attempts to parse text data using detected format or fallback to others
    private parse(text: string): StructuredData {
        // First detect the format
        const predictedFormat = this.detectFormat(text);

        // Try the predicted format first if available
        if (predictedFormat) {
            try {
                switch (predictedFormat) {
                    case "json": return json.from(text);
                    case "xml": return xml.from(text);
                    case "csv": return csv.from(text);
                    case "yaml": return yaml.from(text);
                }
            } catch (e) {
                // Prediction was wrong, continue to fallback
            }
        }
        // Try all formats if prediction failed or predicted format parser failed
        const errors: Record<string, string> = {};

        if (predictedFormat != "json") {
            try { return json.from(text); }
            catch (e) { errors.json = (e as Error).message; }
        }

        if (predictedFormat != "xml") {
            try { return xml.from(text); }
            catch (e) { errors.xml = (e as Error).message; }
        }

        if (predictedFormat != "csv") {
            try { return csv.from(text); }
            catch (e) { errors.csv = (e as Error).message; }
        }

        if (predictedFormat != "yaml") {
            try { return yaml.from(text); }
            catch (e) { errors.yaml = (e as Error).message; }
        }

        throw new Error(`Failed to parse data in any supported format: ${JSON.stringify(errors)}`);
    }

    /**
     * Parse string content directly, automatically detecting its format
     * @param text The string content to parse
     * @returns A StructuredData object with the parsed content
     */
    parseString(text: string): StructuredData {
        return this.parse(text);
    }

    /**
     * Load and parse a file, automatically detecting its format
     * @param path Path to the file to read and parse
     * @returns A Promise resolving to a StructuredData object
     */
    async parseFile(path: PathLike | FileHandle): Promise<StructuredData> {
        const content = await fs.promises.readFile(path, 'utf8');
        return this.parse(content);
    }
}