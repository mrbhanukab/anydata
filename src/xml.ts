import DataFormat from "./types/DataFormat"

const xml: DataFormat = {
  loadFile: function (path: string): Promise<StructuredData> {
    throw new Error("Function not implemented.")
  },

  from: function (text: string): StructuredData {
    throw new Error("Function not implemented.")
  },
}

export default xml
