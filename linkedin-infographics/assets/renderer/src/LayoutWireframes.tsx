import React from "react";
import {AbsoluteFill} from "remotion";
import {fonts} from "./fonts";

const palette = {
  background: "#E7E3D9",
  paper: "#FFFDF8",
  ink: "#111827",
  muted: "#687181",
  line: "#C9C4B8",
  blue: "#216CFF",
  orange: "#FF5B35",
  acid: "#D9F45B",
  yellow: "#FFD84D",
  sky: "#BEE3FF",
} as const;

const WireLine: React.FC<{width: number | string; strong?: boolean; accent?: string}> = ({
  width,
  strong = false,
  accent,
}) => (
  <div
    style={{
      width,
      height: strong ? 9 : 5,
      borderRadius: 999,
      background: accent ?? (strong ? palette.ink : palette.line),
    }}
  />
);

const MiniCanvas: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      position: "relative",
      width: 260,
      height: 325,
      flexShrink: 0,
      overflow: "hidden",
      border: `2px solid ${palette.ink}`,
      borderRadius: 13,
      backgroundColor: palette.paper,
      backgroundImage:
        "linear-gradient(rgba(17,24,39,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,0.035) 1px, transparent 1px)",
      backgroundSize: "10px 10px",
      boxShadow: `5px 5px 0 ${palette.ink}`,
    }}
  >
    {children}
  </div>
);

const MiniHeader: React.FC<{accent?: string}> = ({accent = palette.orange}) => (
  <>
    <div style={{position: "absolute", left: 13, top: 12, display: "flex", gap: 5, alignItems: "center"}}>
      <div style={{width: 6, height: 6, background: accent, borderRadius: 2}} />
      <WireLine width={42} />
    </div>
    <div style={{position: "absolute", left: 13, top: 31, display: "flex", flexDirection: "column", gap: 6}}>
      <WireLine width={142} strong />
      <WireLine width={112} strong accent={accent} />
      <WireLine width={92} />
    </div>
  </>
);

const JourneyRailWireframe: React.FC = () => (
  <MiniCanvas>
    <MiniHeader />
    <div style={{position: "absolute", left: 13, right: 13, top: 83, height: 30, border: `1.5px solid ${palette.ink}`, borderRadius: 6}}>
      <div style={{position: "absolute", left: 8, top: 9}}><WireLine width={51} /></div>
      <div style={{position: "absolute", right: 8, top: 6, width: 64, height: 16, borderRadius: 8, background: palette.ink}} />
    </div>
    <div style={{position: "absolute", left: 27, top: 129, bottom: 37, width: 2, background: palette.blue}} />
    {Array.from({length: 5}).map((_, index) => (
      <React.Fragment key={index}>
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 128 + index * 34,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: index === 2 ? palette.orange : palette.blue,
            border: `2px solid ${palette.paper}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 45,
            top: 124 + index * 34,
            width: 200,
            height: 28,
            border: `1px solid ${index === 2 ? palette.orange : palette.line}`,
            borderRadius: 6,
            background: palette.paper,
          }}
        >
          <div style={{position: "absolute", left: 8, top: 6, display: "flex", flexDirection: "column", gap: 4}}>
            <WireLine width={86} strong={index === 2} />
            <WireLine width={115} />
          </div>
          <div style={{position: "absolute", right: 6, top: 5, width: 28, height: 18, borderRadius: 4, background: index % 2 ? palette.sky : palette.yellow}} />
        </div>
      </React.Fragment>
    ))}
    <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 30, background: palette.ink}} />
  </MiniCanvas>
);

const SplitEngineWireframe: React.FC = () => (
  <MiniCanvas>
    <MiniHeader accent={palette.blue} />
    <div style={{position: "absolute", left: 14, right: 14, top: 86, bottom: 42, display: "grid", gridTemplateColumns: "1fr 1.25fr 1fr", gap: 8}}>
      <div style={{display: "flex", flexDirection: "column", gap: 7}}>
        <div style={{fontFamily: fonts.mono, fontSize: 6, color: palette.orange, letterSpacing: 0.5}}>RAW INPUTS</div>
        {[palette.sky, palette.yellow, palette.paper].map((color, index) => (
          <div key={color} style={{height: 45, border: `1px solid ${palette.ink}`, borderRadius: 6, background: color, padding: 7}}>
            <WireLine width={42 + index * 5} strong />
            <div style={{marginTop: 7}}><WireLine width="80%" /></div>
          </div>
        ))}
      </div>
      <div style={{position: "relative", border: `2px solid ${palette.ink}`, borderRadius: 10, background: palette.ink, padding: 8}}>
        <div style={{fontFamily: fonts.mono, fontSize: 6, color: palette.acid, textAlign: "center"}}>AUTOMATION ENGINE</div>
        <div style={{position: "absolute", left: 9, right: 9, top: 29, height: 50, borderRadius: 7, background: "#172944", padding: 8}}>
          <WireLine width="65%" accent={palette.sky} />
          <div style={{marginTop: 7}}><WireLine width="90%" accent="#52627A" /></div>
          <div style={{marginTop: 5}}><WireLine width="72%" accent="#52627A" /></div>
        </div>
        <div style={{position: "absolute", left: 9, right: 9, top: 89, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6}}>
          {Array.from({length: 4}).map((_, index) => (
            <div key={index} style={{height: 47, borderRadius: 6, border: "1px solid #42516A", background: index === 2 ? "#253C63" : "#132238", padding: 6}}>
              <WireLine width="70%" accent={index === 2 ? palette.orange : "#75849A"} />
              <div style={{marginTop: 6}}><WireLine width="90%" accent="#42516A" /></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display: "flex", flexDirection: "column", gap: 7}}>
        <div style={{fontFamily: fonts.mono, fontSize: 6, color: palette.blue, letterSpacing: 0.5}}>POST PACK</div>
        {[
          {label: "GIF", color: palette.orange},
          {label: "PNG", color: palette.blue},
          {label: "COPY", color: palette.acid},
        ].map((item) => (
          <div key={item.label} style={{height: 45, border: `1px solid ${palette.ink}`, borderRadius: 6, background: palette.paper, display: "flex", alignItems: "center", gap: 7, padding: 7}}>
            <div style={{width: 24, height: 29, borderRadius: 4, background: item.color, border: `1px solid ${palette.ink}`}} />
            <WireLine width={30} strong />
          </div>
        ))}
      </div>
    </div>
    <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 30, background: palette.ink}} />
  </MiniCanvas>
);

const OrbitMapWireframe: React.FC = () => (
  <MiniCanvas>
    <MiniHeader accent={palette.yellow} />
    <svg width="260" height="325" viewBox="0 0 260 325" style={{position: "absolute", inset: 0}} aria-hidden="true">
      <g transform="translate(0 14)">
        {[
          {x: 52, y: 123},
          {x: 201, y: 123},
          {x: 37, y: 215},
          {x: 130, y: 250},
          {x: 219, y: 215},
        ].map((point, index) => (
          <g key={index}>
            <line x1="130" y1="184" x2={point.x} y2={point.y} stroke={index === 3 ? palette.orange : palette.line} strokeWidth="2" strokeDasharray="4 4" />
            <circle cx={point.x} cy={point.y} r="24" fill={index === 3 ? palette.acid : palette.paper} stroke={palette.ink} strokeWidth="1.5" />
            <rect x={point.x - 10} y={point.y - 7} width="20" height="5" rx="2" fill={index === 3 ? palette.ink : index % 2 ? palette.blue : palette.orange} />
            <rect x={point.x - 13} y={point.y + 3} width="26" height="4" rx="2" fill={palette.line} />
          </g>
        ))}
        <circle cx="130" cy="184" r="45" fill={palette.ink} />
        <circle cx="130" cy="184" r="34" fill="none" stroke={palette.blue} strokeWidth="2" />
        <rect x="108" y="177" width="44" height="9" rx="3" fill={palette.acid} />
        <rect x="114" y="191" width="32" height="5" rx="2" fill="#66758B" />
      </g>
    </svg>
    <div style={{position: "absolute", left: 13, right: 13, bottom: 10, height: 25, borderRadius: 6, background: palette.ink}} />
  </MiniCanvas>
);

const EditorialStackWireframe: React.FC = () => (
  <MiniCanvas>
    <MiniHeader accent={palette.orange} />
    <div style={{position: "absolute", left: 13, right: 13, top: 85, height: 74, border: `1px solid ${palette.ink}`, borderRadius: 8, background: palette.sky, padding: 10}}>
      <WireLine width="60%" strong />
      <div style={{marginTop: 7}}><WireLine width="82%" /></div>
      <div style={{position: "absolute", right: 10, top: 12, width: 58, height: 49, borderRadius: 6, background: palette.paper, border: `1px solid ${palette.ink}`, padding: 7}}>
        <div style={{display: "flex", gap: 4, alignItems: "end", height: 28}}>
          {[12, 22, 17, 29].map((height, index) => <div key={index} style={{width: 7, height, background: index === 3 ? palette.orange : palette.blue}} />)}
        </div>
      </div>
    </div>
    <div style={{position: "absolute", left: 13, right: 13, top: 168, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7}}>
      {Array.from({length: 4}).map((_, index) => (
        <div key={index} style={{height: 60, border: `1px solid ${palette.line}`, borderRadius: 7, background: palette.paper, padding: 8}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div style={{width: 18, height: 18, borderRadius: 4, background: [palette.orange, palette.yellow, palette.blue, palette.acid][index]}} />
            <WireLine width={40} strong />
          </div>
          <div style={{marginTop: 8}}><WireLine width="85%" /></div>
          <div style={{marginTop: 5}}><WireLine width="62%" /></div>
        </div>
      ))}
    </div>
    <div style={{position: "absolute", left: 13, right: 13, bottom: 13, height: 37, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6}}>
      {Array.from({length: 3}).map((_, index) => (
        <div key={index} style={{borderRadius: 6, background: index === 1 ? palette.ink : palette.paper, border: `1px solid ${palette.ink}`, padding: 7}}>
          <WireLine width="70%" strong accent={index === 1 ? palette.acid : palette.ink} />
          <div style={{marginTop: 5}}><WireLine width="90%" accent={index === 1 ? "#5D6B80" : palette.line} /></div>
        </div>
      ))}
    </div>
  </MiniCanvas>
);

type OptionProps = {
  letter: string;
  name: string;
  bestFor: string;
  motion: string;
  accent: string;
  preview: React.ReactNode;
};

const Option: React.FC<OptionProps> = ({letter, name, bestFor, motion, accent, preview}) => (
  <div
    style={{
      width: 725,
      height: 420,
      boxSizing: "border-box",
      border: `1.5px solid ${palette.ink}`,
      borderRadius: 22,
      background: "rgba(255,253,248,0.72)",
      padding: 28,
      display: "flex",
      gap: 34,
      boxShadow: "8px 8px 0 rgba(17,24,39,0.08)",
    }}
  >
    {preview}
    <div style={{flex: 1, paddingTop: 8}}>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: accent,
          color: accent === palette.acid || accent === palette.yellow ? palette.ink : palette.paper,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.mono,
          fontSize: 17,
          fontWeight: 600,
        }}
      >
        {letter}
      </div>
      <div style={{fontFamily: fonts.display, fontSize: 35, fontWeight: 740, letterSpacing: -1.2, marginTop: 18, color: palette.ink}}>
        {name}
      </div>
      <div style={{marginTop: 23, fontFamily: fonts.mono, fontSize: 10, fontWeight: 600, letterSpacing: 1, color: accent}}>
        BEST FOR
      </div>
      <div style={{fontFamily: fonts.body, fontSize: 17, fontWeight: 550, lineHeight: 1.3, color: palette.muted, marginTop: 7}}>
        {bestFor}
      </div>
      <div style={{marginTop: 20, fontFamily: fonts.mono, fontSize: 10, fontWeight: 600, letterSpacing: 1, color: accent}}>
        MOTION IDEA
      </div>
      <div style={{fontFamily: fonts.body, fontSize: 15, lineHeight: 1.3, color: palette.muted, marginTop: 7}}>
        {motion}
      </div>
    </div>
  </div>
);

export const LayoutWireframes: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: palette.background,
      backgroundImage:
        "linear-gradient(rgba(17,24,39,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,0.035) 1px, transparent 1px)",
      backgroundSize: "24px 24px",
      padding: "52px 60px",
      fontFamily: fonts.body,
      color: palette.ink,
    }}
  >
    <div style={{display: "flex", alignItems: "flex-end", justifyContent: "space-between"}}>
      <div>
        <div style={{fontFamily: fonts.mono, color: palette.blue, fontSize: 12, fontWeight: 600, letterSpacing: 1.6}}>
          LAYOUT DIRECTION / BEFORE CONTENT
        </div>
        <div style={{fontFamily: fonts.display, fontSize: 58, fontWeight: 760, letterSpacing: -2.3, marginTop: 10}}>
          Choose the visual grammar first.
        </div>
      </div>
      <div style={{fontFamily: fonts.mono, fontSize: 11, color: palette.muted, letterSpacing: 0.8, paddingBottom: 8}}>
        PICK A / B / C / D → THEN POPULATE
      </div>
    </div>
    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 38}}>
      <Option
        letter="A"
        name="Journey Rail"
        bestFor="Step-by-step tutorials, workflows and repeatable playbooks."
        motion="The signal moves down a dedicated rail and reveals one step at a time."
        accent={palette.orange}
        preview={<JourneyRailWireframe />}
      />
      <Option
        letter="B"
        name="Split Engine"
        bestFor="Automation systems, before/after stories and input-to-output explainers."
        motion="Inputs feed the central engine; finished assets light up on the right."
        accent={palette.blue}
        preview={<SplitEngineWireframe />}
      />
      <Option
        letter="C"
        name="Orbit Map"
        bestFor="Frameworks, tool stacks, decision maps and one idea with many parts."
        motion="A pulse leaves the core and visits each related node in sequence."
        accent={palette.yellow}
        preview={<OrbitMapWireframe />}
      />
      <Option
        letter="D"
        name="Editorial Stack"
        bestFor="Reports, research summaries, lessons and data-backed breakdowns."
        motion="The hero insight lands first; evidence and metrics build underneath it."
        accent={palette.acid}
        preview={<EditorialStackWireframe />}
      />
    </div>
  </AbsoluteFill>
);
