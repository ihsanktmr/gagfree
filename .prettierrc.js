module.exports = {
  importOrder: [
    "^react$",
    "<THIRD_PARTY_MODULES>",
    "^@components/(.*)$",
    "^@hooks/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
};
