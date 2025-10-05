import { promises as fs, PathLike } from "fs"
import DataFormat from "./types/DataFormat"
import StructuredData from "./StructuredData.js"

// https://toml.io/en/v1.0.0

const parseToml = (text: string): any => {
  // TODO: Implement a full TOML parser
}

const toml: DataFormat = {
  loadFile: async function(path: PathLike | fs.FileHandle): Promise<StructuredData> {
    const text = (await fs.readFile(path)).toString()
    return toml.from(text)
  },
  
  from: function(text: string): StructuredData {
    const parsed = parseToml(text)
    return new StructuredData(parsed, "toml")
  }
}

export default toml