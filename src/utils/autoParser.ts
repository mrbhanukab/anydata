import StructuredData from "../StructuredData.js";
import { json, xml, csv, yaml } from "../index.js";
import fs from "fs";
import { PathLike } from "fs";
import { FileHandle } from 'fs/promises';

type DataFormatType = "json" | "xml" | "csv" | "yaml";

// Class responsible for detecting and parsing data formats automatically
export class autoParser {
    // Property to store the detected format
    private predictedFormat: DataFormatType | null = null;

    // Method to detect the format
    private detectFormat(text: string): DataFormatType | null {
        text = text.trim();

        // Check for JSON - starts with { or [ and ends with } or ]
        if ((text.startsWith("{") && text.endsWith("}")) ||
            (text.startsWith("[") && text.endsWith("]"))) {
            this.predictedFormat = "json";
            return this.predictedFormat;
        }
        // Check for XML - starts with < and contains closing tags
        else if (text.startsWith("<") &&
            /<\/?[a-zA-Z][\w\-\.]*[^<>]*>/i.test(text)) {
            this.predictedFormat = "xml";
            return this.predictedFormat;
        }
        // Check for CSV - contains commas or semicolons and multiple lines
        else if (/\n/g.test(text) &&
            /([,;])/g.test(text) &&
            !/[{}[\]<>]/.test(text)) {
            this.predictedFormat = "csv";
            return this.predictedFormat;
        }
        // Check for YAML - typical YAML patterns
        else if (/^[a-zA-Z0-9_-]+:\s/m.test(text) ||
            /^\s*-\s+[a-zA-Z0-9_-]+/m.test(text)) {
            this.predictedFormat = "yaml";
            return this.predictedFormat;
        }
        this.predictedFormat = null;
        return null;
    }

    // Attempts to parse text data using detected format or fallback to others
    private parse(text: string): StructuredData {
        // First detect the format
        this.detectFormat(text);

        // Try the predicted format first if available
        if (this.predictedFormat) {
            try {
                switch (this.predictedFormat) {
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

        if (this.predictedFormat != "json") {
            try { return json.from(text); }
            catch (e) { errors.json = (e as Error).message; }
        }

        if (this.predictedFormat != "xml") {
            try { return xml.from(text); }
            catch (e) { errors.xml = (e as Error).message; }
        }

        if (this.predictedFormat != "csv") {
            try { return csv.from(text); }
            catch (e) { errors.csv = (e as Error).message; }
        }

        if (this.predictedFormat != "yaml") {
            try { return yaml.from(text); }
            catch (e) { errors.yaml = (e as Error).message; }
        }

        throw new Error(`Failed to parse data in any supported format: ${JSON.stringify(errors)}`);
    }

    /**
     * Public method to parse any data format automatically
     * @param input The text data or file path to parse
     * @returns A StructuredData object with the parsed content or Promise of it
     */
    parseData(text: string): StructuredData;
    parseData(path: PathLike | FileHandle): Promise<StructuredData>;
    parseData(input: string | PathLike | FileHandle): StructuredData | Promise<StructuredData> {
        // If input is string, parse it directly
        if (typeof input === 'string') {
            return this.parse(input);
        }
        
        // Otherwise, it's a file path or handle - read and then parse
        return (async () => {
            const content = await fs.promises.readFile(input, 'utf8');
            return this.parse(content);
        })();
    }
}