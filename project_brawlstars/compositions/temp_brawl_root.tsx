import React from "react";
import { Composition, registerRoot } from "remotion";
import { ProjectBrawlstarsShort2V2 } from "../shorts/project_brawlstars_short_2_v2/ProjectBrawlstarsShort2V2";
import { mbgcSceneConfigV2 } from "../shorts/project_brawlstars_short_2_v2/config";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ProjectBrawlstarsShort2V2"
        component={ProjectBrawlstarsShort2V2}
        durationInFrames={mbgcSceneConfigV2.durationInFrames}
        fps={mbgcSceneConfigV2.fps}
        width={1080}
        height={1920}
        defaultProps={{ config: mbgcSceneConfigV2 }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
