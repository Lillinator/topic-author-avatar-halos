import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-topic-author-halo",

  initialize() {
    withPluginApi("0.8", (api) => {
      
      api.addPostClassesCallback((post) => {
        const topicCreatorId = post.topic?.details?.created_by?.id;
        
        if (post.user_id && topicCreatorId === post.user_id) {
          return ["halo-topic-author"];
        }
        return [];
      });

      const color = settings.halo_color || "var(--tertiary)";
      
      const sizeMap = {
        small: "4px 4px",
        medium: "6px 6px",
        large: "8px 8px",
      };
      const shadowSize = sizeMap[settings.halo_size] || sizeMap["medium"];

      const percentMap = {
        "0.25": "25%",
        "0.5": "50%",
        "0.75": "75%",
        "1.0": "100%",
      };
      const alphaPercent = percentMap[settings.halo_transparency] || "50%";

      let cssString = `
        .halo-topic-author .topic-avatar img.avatar {
          box-shadow: 0 0 ${shadowSize} color-mix(in srgb, ${color} ${alphaPercent}, transparent) !important;
        }

        /* Clean up quotes and topic maps so they don't inherit the halo */
        aside.quote img.avatar,
        .topic-map__users-list img.avatar,
        .topic-map img.avatar,
        section.map img.avatar {
          box-shadow: none !important;
        }
      `;

      if (cssString) {
        const styleNode = document.createElement("style");
        styleNode.type = "text/css";
        styleNode.innerHTML = cssString;
        document.head.appendChild(styleNode);
      }
    });
  },
};
