//TODO: Should handle comments inside multiline strings

import { promises as fs, PathLike } from "fs"
import DataFormat from "./types/DataFormat"
import StructuredData from "./StructuredData.js"

// https://toml.io/en/v1.0.0

const parseToml = (text: string): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  text = text
    .split("\n")
    .map(line => removeComments(line)) 
    .filter(line => line.trim() !== "")
    .join("\n")
  console.log(text)
  
  return result
}

const removeComments = (line: string): string => {
  // This regex matches:
  // - Quoted strings (both single and double quotes)
  // - Comments (# followed by anything until end of line)
  //? Why: https://toml.io/en/v1.0.0#comment
  const regex = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|#.*$/g

  return line.replace(regex, (match) => {
    
    //! If the match starts with a quote, it's a string - keep it
    if (match.startsWith('"') || match.startsWith("'")) {
      return match
    }
    return ''
  }).trim()
}

const toml: DataFormat = {
  loadFile: async function (path: PathLike | fs.FileHandle): Promise<StructuredData> {
    const text = (await fs.readFile(path)).toString()
    return toml.from(text)
  },

  from: function (text: string): StructuredData {
    const parsed = parseToml(text)
    return new StructuredData(parsed, "toml")
  }
}

export default toml