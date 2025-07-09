export default interface DataFormat {
  loadFile(path: string): Promise<StructuredData>
  from(text: string): StructuredData
}
