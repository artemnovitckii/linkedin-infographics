import React from "react";
import {Composition, Folder, Still} from "remotion";
import exampleData from "../examples/meta-linkedin-infographics.json";
import {LinkedInInfographic, LinkedInInfographicCover} from "./LinkedInInfographic";
import {LayoutWireframes} from "./LayoutWireframes";
import {infographicSchema, type InfographicProps} from "./schema";

const defaultProps = infographicSchema.parse(exampleData) satisfies InfographicProps;

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="LinkedIn">
      <Composition
        id="LinkedInInfographic"
        component={LinkedInInfographic}
        durationInFrames={150}
        fps={15}
        width={800}
        height={1000}
        schema={infographicSchema}
        defaultProps={defaultProps}
      />
      <Still
        id="LinkedInInfographicCover"
        component={LinkedInInfographicCover}
        width={800}
        height={1000}
        schema={infographicSchema}
        defaultProps={defaultProps}
      />
      <Still id="LayoutWireframes" component={LayoutWireframes} width={1600} height={1100} />
    </Folder>
  );
};
