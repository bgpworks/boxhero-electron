/** @type {import('lint-staged').Config} */
module.exports = {
  "**/*.(ts|tsx)": () => "npx tsc --noEmit",
  "**/*.(ts|tsx|js)": (filenames) => [
    `npx eslint --fix ${filenames.join(" ")}`,
    `npx prettier --write ${filenames.join(" ")}`,
  ],
  "**/*.(md|json)": (filenames) =>
    `npx prettier --write ${filenames.join(" ")}`,
};
