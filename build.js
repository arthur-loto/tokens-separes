const StyleDictionaryPackage = require("style-dictionary");
const StyleDictionary = require("style-dictionary");

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED

/*Version pour css et sccs avec la nomenclature -opt- et -doc-*/
StyleDictionary.registerFilter({
  name: "isOpt",
  matcher: function (token) {
    return !(token.name.includes("-opt-") || token.name.includes("-doc-"));
  },
});

/*Version pour ios avec la nomenclature Opt et Doc*/
StyleDictionary.registerFilter({
  name: "isOptIos",
  matcher: function (token) {
    return !(token.name.includes("Opt") || token.name.includes("Doc"));
  },
});

StyleDictionary.registerTransform({
  name: "shadow/spreadShadow",
  type: "value",
  matcher: function (token) {
    return token.type === "boxShadow";
  },
  transformer: (token) => {
    const shadow = token.value;
    return `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
  },
});
StyleDictionary.registerTransform({
  name: "any/px",
  type: "value",
  matcher: function (token) {
    return [
      "borderRadius",
      "spacing",
      "borderWidth",
      "fontSizes",
      "fontSize",
      "sizing",
      "lineHeight",
      "lineHeights",
    ].includes(token.type);
  },
  transformer: (token) => {
    const unity = ["px", "%", "em", "rem", "vw"];
    return unity.some((item) => token.value.toString().includes(item))
      ? `${token.value}`
      : `${token.value}px`;
  },
});

StyleDictionary.registerFormat({
  name: "css/alphabeticalOrder",
  formatter: function ({ dictionary, file, options }) {
    const { outputReferences } = options;
    dictionary.allTokens
      .sort(StyleDictionary.formatHelpers.sortByName)
      .map((token) => `${token.name} = ${token.value}`)
      .join("\n");

    return (
      StyleDictionary.formatHelpers.fileHeader({ file }) +
      ":root {\n" +
      StyleDictionary.formatHelpers.formattedVariables({
        format: "css",
        dictionary,
        outputReferences,
      }) +
      "\n}\n"
    );
  },
});

StyleDictionary.registerFormat({
  name: "scss/alphabeticalOrder",
  formatter: function ({ dictionary, file, options }) {
    const { outputReferences } = options;
    dictionary.allTokens
      .sort(StyleDictionary.formatHelpers.sortByName)
      .map((token) => `${token.name} = ${token.value}`)
      .join("\n");

    return (
      StyleDictionary.formatHelpers.fileHeader({ file }) +
      StyleDictionary.formatHelpers.formattedVariables({
        format: "sass",
        dictionary,
        outputReferences,
      }) +
      "\n"
    );
  },
});

function getStyleDictionaryConfig(brand, platform) {
  return {
    source: [`transformer-output/${brand}.json`],
    platforms: {
      scss: {
        transformGroup: "scss",
        transforms: [
          "shadow/spreadShadow",
          "attribute/cti",
          "name/cti/kebab",
          "color/hex",
          "any/px",
        ],
        buildPath: "build/scss/",
        files: [
          {
            destination: `${brand}-variables.scss`,
            format: "scss/alphabeticalOrder",
            options: {
              showFileHeader: true,
            },
            filter: "isOpt",
          },
        ],
      },
      css: {
        transformGroup: "css",
        transforms: [
          "shadow/spreadShadow",
          "attribute/cti",
          "name/cti/kebab",
          "color/hex",
          "any/px",
          "size/rem",
        ],
        buildPath: "build/css/",
        files: [
          {
            destination: `${brand}-variables.css`,
            format: "css/alphabeticalOrder",
            options: {
              showFileHeader: true,
            },
            filter: "isOpt",
          },
        ],
      },
      ios: {
        transformGroup: "ios",
        buildPath: `build/ios/${brand}/`,
        files: [
          {
            destination: "tokens.h",
            format: "ios/macros",
            filter: "isOptIos",
          },
        ],
      },
    },
  };
}

console.log("Build started...");

// PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

["decisions-lq", "decisions-moj", "decisions-jel"].map(function (brand) {
  ["scss", "css", "ios"].map(function (platform) {
    console.log("\n==============================================");
    console.log(`\nProcessing: [${platform}] [${brand}]`);

    const StyleDictionary = StyleDictionaryPackage.extend(
      getStyleDictionaryConfig(brand, platform)
    );

    StyleDictionary.buildPlatform(platform);

    console.log("\nEnd processing");
  });
});

console.log("\n==============================================");
console.log("\nBuild completed!");
