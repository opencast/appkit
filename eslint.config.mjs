import shared from "@opencast/eslint-config-ts-react";

export default [
  ...shared,
  {
    ignores: ["dist/"],
  },
];
