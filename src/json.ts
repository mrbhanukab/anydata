import { promises as fs, PathLike } from "fs"
import DataFormat from "./types/DataFormat"
import StructuredData from "./StructuredData.js"

const json: DataFormat = {
  loadFile: async function (path: PathLike | fs.FileHandle): Promise<StructuredData> {
    const text = (await fs.readFile(path)).toString()
    return json.from(text)
  },

  from: function (text: string): StructuredData {
    const object = JSON.parse(text)
    return new StructuredData(object, "json")
  },
}

export default json
