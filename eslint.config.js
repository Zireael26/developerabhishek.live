import next from 'eslint-config-next';

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...next,
  {
    rules: {
      // Portfolio-specific overrides go here. Keep the list tight — every override
      // has a reason. Empty is fine.
    },
  },
];

export default config;
