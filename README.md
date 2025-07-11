# anydata

> Simple library to load, handle and convert data in different types such as JSON, CSV, XML, and YAML

> [!WARNING]
> This project is under development. Some functionalities mentioned in this README are not implemented yet.

> [!NOTE]
> This project is currently maintained by a campus club, and we are prioritizing contributions from club members for existing issues. While we may not assign these issues to external contributors at the moment, you're still welcome to contribute by improving other areas or suggesting new ideas.


What can you do with this library?

- Load data in many formats from text or from a file (currently supports json, csv, xml, yaml)
- Convert data into any format (currently supports json, csv, xml, yaml)

## Installing

Ensure you have **Node.js** installed in your system (recommended Node.js v18 or higher).

```sh
# run the following command to install
$ npm install anydata
```

## Usage

```ts
import { csv, json, xml, yaml } from anydata

// load json from text
const data1 = json.from('{ "a": 1 }')
// load json from a file
const data2 = await json.loadFile("data.json")

// access data
data1.data

// convert data into other formats
data1.toYaml()
// export data as a file into other formats
await data1.exportYaml("export.yml")

```

---

## Contributing

Feel free to submit new features, improvements, or bug fixes.

- Before starting, check the Issues tab to see if someone is already working on it.
- If not, open a [new issue](https://github.com/Mozilla-Campus-Club-of-SLIIT/anydata/issues/new) describing your idea or bug, and request to be assigned.
- You can also browse existing [issues](https://github.com/Mozilla-Campus-Club-of-SLIIT/anydata/issues) and ask to take one on.

## Submitting features

### 1. Fork and clone the repository

First, fork the repository to your GitHub account and then clone it locally.

```sh
# Fork the repo (click the 'Fork' button on GitHub)
# Clone the forked repo
$ git clone https://github.com/YOUR-USERNAME/anydata.git
$ cd anydata
```

### 2. Create a Feature Branch

Once assigned, create a new branch for your work:

```sh
$ git checkout -b feature/your-feature-name
```

### 3. Make Changes & Commit

- Make your changes and test them locally.
- Follow formatting and coding standards
- Ensure your code passes:
  - Format checks
  - Linter checks
  - All tests

Check the [Available scripts](#available-scripts) section to see scripts available for above purposes.

Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

Avoid large PRs; make atomic commits.

Example:

```sh
$ git add .
$ git commit -m "feat: added a new about section"
```

### 4. Push & Create a Pull Request (PR)

```sh
$ git push origin feature/your-feature-name
```

Go to the **GitHub repository**, open a **Pull Request (PR)** from your branch, and add a short description.

---

### Available scripts

The following scripts are available for developers

- **`npm install --include=dev`**: installs all the necessary dependencies (make sure to include the `--include=dev` flag)
- **`npm run build`**: bundles the library
- **`npm run lint` or `npm run lint:fix`**: Runs the linter against the code. `lint:fix` variant attempts to fix any linter issues.
- **`npm run format`**: Format the code according to repository standards.
- **`npm test`**: Test the code

---

### Getting Help

If you have any questions:

- Check the existing issues or discussions.
- Reach out to the **Mozilla Campus Club of SLIIT** team.
- Open a new issue if needed.

---

## 🎉 Happy Coding!
