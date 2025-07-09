import { promises as fs, PathLike } from "fs"
import StructuredData from "../StructuredData.js"

export default interface DataFormat {
  loadFile(path: PathLike | fs.FileHandle): Promise<StructuredData>
  from(text: string): StructuredData
}
