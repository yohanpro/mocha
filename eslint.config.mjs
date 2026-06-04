import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

/**
 * FSD Layer 계층 (낮을수록 하위 레이어)
 *
 * shared → entities → features → widgets → app(pages)
 *
 * 규칙: 상위 레이어는 하위 레이어만 import 가능
 * 같은 레이어의 다른 slice는 import 불가 (shared 제외)
 */
const FSD_LAYERS = ["shared", "entities", "features", "widgets", "app"];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // FSD boundaries rules
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        {
          type: "shared",
          pattern: "src/shared/**",
        },
        {
          type: "entities",
          pattern: "src/entities/*/**",
          capture: ["slice"],
        },
        {
          type: "features",
          pattern: "src/features/*/**",
          capture: ["slice"],
        },
        {
          type: "widgets",
          pattern: "src/widgets/*/**",
          capture: ["slice"],
        },
        {
          type: "app",
          pattern: "app/**",
        },
      ],
      "boundaries/ignore": ["**/*.test.*", "**/*.spec.*", "**/*.stories.*"],
    },
    rules: {
      // 레이어 간 단방향 의존성 강제
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            // shared: 아무것도 import 불가
            {
              from: "shared",
              allow: [],
            },
            // entities: shared + 같은 slice 내부 허용
            {
              from: "entities",
              allow: ["shared", ["entities", { slice: "${slice}" }]],
            },
            // features: shared, entities만 허용 (다른 feature slice 불가)
            {
              from: "features",
              allow: [
                "shared",
                "entities",
                // 같은 feature 내부는 허용
                ["features", { slice: "${slice}" }],
              ],
            },
            // widgets: shared, entities, features 허용
            {
              from: "widgets",
              allow: [
                "shared",
                "entities",
                "features",
                // 같은 widget 내부는 허용
                ["widgets", { slice: "${slice}" }],
              ],
            },
            // app(pages): 모든 레이어 허용
            {
              from: "app",
              allow: ["shared", "entities", "features", "widgets"],
            },
          ],
        },
      ],

      // 같은 레이어의 다른 slice import 금지 (features, entities, widgets)
      "boundaries/no-unknown": "error",
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/shared/**", // shared는 내부 자유도 허용
  ]),
]);

export default eslintConfig;
