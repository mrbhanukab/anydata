import assert from "assert"
import { parse } from "../src/index.js"
import { it } from "mocha"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe("parse", () => {
  // Temp file path for tests
  const tempDir = path.join(__dirname, "temp")

  before(() => {
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
    }
  })

  after(() => {
    // Clean up temp directory after all tests (rm -rf)
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  })

  describe("from", () => {
    it("should detect and parse JSON data from string", () => {
      const jsonData = '{"name":"John","age":30}'
      const result = parse.from(jsonData)

      assert.deepStrictEqual(result.data, { name: "John", age: 30 })
    })

    it("should detect and parse XML data from string", () => {
      const xmlData = "<person><name>John</name><age>30</age></person>"
      const result = parse.from(xmlData)

      assert.deepStrictEqual(result.data, { person: { name: "John", age: "30" } })
    })

    it("should throw 'not implemented' error for CSV data ⚠️", () => {
      const csvData = "name,age\nJohn,30"
      try {
        parse.from(csvData)
        assert.fail("Should have thrown 'not implemented' error")
      } catch (e) {
        assert.ok(
          e instanceof Error && e.message.includes("not implemented"),
          "Expected 'not implemented' error message",
        )
      }
    })

    it("should throw 'not implemented' error for YAML data ⚠️", () => {
      const yamlData = "name: John\nage: 30"
      try {
        parse.from(yamlData)
        assert.fail("Should have thrown 'not implemented' error")
      } catch (e) {
        assert.ok(
          e instanceof Error && e.message.includes("not implemented"),
          "Expected 'not implemented' error message",
        )
      }
    })

    it("should throw an error for unparseable data", () => {
      const invalidData = "This is not valid in any supported format"
      assert.throws(() => parse.from(invalidData), Error)
    })
  })

  describe("loadFile", () => {
    it("should detect and parse JSON data from file", async () => {
      const filePath = path.join(tempDir, "test.json")
      const jsonData = '{"name":"John","age":30}'

      fs.writeFileSync(filePath, jsonData)

      const result = await parse.loadFile(filePath)

      assert.deepStrictEqual(result.data, { name: "John", age: 30 })
    })

    it("should detect and parse XML data from file", async () => {
      const filePath = path.join(tempDir, "test.xml")
      const xmlData = "<person><name>John</name><age>30</age></person>"

      fs.writeFileSync(filePath, xmlData)

      const result = await parse.loadFile(filePath)

      assert.deepStrictEqual(result.data, { person: { name: "John", age: "30" } })
    })

    it("should throw 'not implemented' error for CSV file ⚠️", async () => {
      const filePath = path.join(tempDir, "test.csv")
      const csvData = "name,age\nJohn,30"

      fs.writeFileSync(filePath, csvData)

      try {
        await parse.loadFile(filePath)
        assert.fail("Should have thrown 'not implemented' error")
      } catch (e) {
        assert.ok(
          e instanceof Error && e.message.includes("not implemented"),
          "Expected 'not implemented' error message",
        )
      }
    })

    it("should throw 'not implemented' error for YAML file ⚠️", async () => {
      const filePath = path.join(tempDir, "test.yaml")
      const yamlData = "name: John\nage: 30"

      fs.writeFileSync(filePath, yamlData)

      try {
        await parse.loadFile(filePath)
        assert.fail("Should have thrown 'not implemented' error")
      } catch (e) {
        assert.ok(
          e instanceof Error && e.message.includes("not implemented"),
          "Expected 'not implemented' error message",
        )
      }
    })

    it("should detect format regardless of file extension", async () => {
      const filePath = path.join(tempDir, "test.txt")
      const jsonData = '{"name":"John","age":30}'

      fs.writeFileSync(filePath, jsonData)

      const result = await parse.loadFile(filePath)

      assert.deepStrictEqual(result.data, { name: "John", age: 30 })
    })

    it("should throw an error for unparseable file", async () => {
      const filePath = path.join(tempDir, "invalid.txt")
      const invalidData = "This is not valid in any supported format"

      fs.writeFileSync(filePath, invalidData)

      await assert.rejects(async () => {
        await parse.loadFile(filePath)
      }, Error)
    })
  })

  describe("Edge cases", () => {
    it("should handle empty input", () => {
      assert.throws(() => parse.from(""), Error)
    })

    it("should handle whitespace-only input", () => {
      assert.throws(() => parse.from("   \n   "), Error)
    })

    it("should handle ambiguous formats", () => {
      // This string looks like XML but is actually valid JSON
      const ambiguousData = '{"tag": "<element>value</element>"}'

      const result = parse.from(ambiguousData)
      // Use type assertion to help TypeScript understand the structure
      const data = result.data as { tag: string }
      assert.strictEqual(data.tag, "<element>value</element>")
    })
  })
})
