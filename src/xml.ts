import { promises as fs, PathLike } from "fs"
import DataFormat from "./types/DataFormat"
import StructuredData from "./StructuredData.js"

const xml: DataFormat = {
  loadFile: async function (path: PathLike | fs.FileHandle): Promise<StructuredData> {
    throw new Error("Function not implemented.")
  },

  from: function (text: string): StructuredData {
    throw new Error("Function not implemented.")
  },
}

export default xml
