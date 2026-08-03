import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {fonts} from "./fonts";
import type {InfographicProps} from "./schema";

const colors = {
  paper: "#F1EEE6",
  white: "#FFFDF8",
  ink: "#111827",
  navy: "#0B1930",
  muted: "#667085",
  line: "#CEC8BC",
  blue: "#216CFF",
  orange: "#FF5B35",
  acid: "#D9F45B",
  yellow: "#FFD84D",
  sky: "#BEE3FF",
} as const;

type CanvasProps = InfographicProps & {manualFrame?: number};

const getActiveIndex = (frame: number) => Math.min(4, Math.max(0, Math.floor((frame - 7) / 27)));

const getFocus = (frame: number, index: number) => {
  const center = 15 + index * 27;
  return interpolate(Math.abs(frame - center), [0, 18], [1, 0], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const Shell: React.FC<{
  props: InfographicProps;
  layoutLabel: string;
  children: React.ReactNode;
}> = ({props, layoutLabel, children}) => (
  <AbsoluteFill
    style={{
      backgroundColor: colors.paper,
      backgroundImage:
        "linear-gradient(rgba(17,24,39,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,0.035) 1px, transparent 1px)",
      backgroundSize: "20px 20px",
      color: colors.ink,
      fontFamily: fonts.body,
      overflow: "hidden",
    }}
  >
    <div style={{position: "absolute", inset: 17, border: `1px solid ${colors.ink}`, borderRadius: 20}} />
    <div style={{position: "absolute", left: 38, top: 29, display: "flex", gap: 9, alignItems: "center", fontFamily: fonts.mono, fontSize: 9, fontWeight: 600, letterSpacing: 1.2, color: colors.blue}}>
      <span style={{width: 8, height: 8, borderRadius: 2, background: colors.orange}} />
      {props.eyebrow.toUpperCase()}
    </div>
    <div style={{position: "absolute", right: 38, top: 29, fontFamily: fonts.mono, fontSize: 8, fontWeight: 600, letterSpacing: 0.8, color: colors.muted}}>
      {layoutLabel.toUpperCase()} / 800 × 1000
    </div>
    <div style={{position: "absolute", left: 38, top: 66}}>
      <div style={{fontFamily: fonts.display, fontSize: 49, fontWeight: 760, letterSpacing: -2.1, lineHeight: 0.9}}>{props.titleLead}</div>
      <div style={{fontFamily: fonts.display, fontSize: 49, fontWeight: 760, letterSpacing: -2.1, lineHeight: 0.9, color: colors.orange, marginTop: 5}}>{props.titleAccent}</div>
      <div style={{fontFamily: fonts.body, fontSize: 13, fontWeight: 560, color: colors.muted, marginTop: 11}}>{props.subtitle}</div>
    </div>
    <div style={{position: "absolute", right: 39, top: 82, width: 72, height: 72, borderRadius: "50%", border: `2px solid ${colors.blue}`, display: "flex", alignItems: "center", justifyContent: "center"}}>
      <div style={{width: 40, height: 40, borderRadius: "50%", background: colors.blue, boxShadow: `0 0 0 8px ${colors.sky}`}} />
    </div>
    {children}
    <div style={{position: "absolute", left: 17, right: 17, bottom: 17, height: 118, borderRadius: "0 0 19px 19px", background: colors.navy, color: colors.white}}>
      <div style={{height: 77, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", alignItems: "center", padding: "0 27px"}}>
        {props.metrics.map((metric, index) => (
          <div key={metric.value} style={{borderLeft: index === 0 ? "none" : "1px solid rgba(255,255,255,0.18)", paddingLeft: index === 0 ? 0 : 22}}>
            <div style={{fontFamily: fonts.display, fontSize: 20, fontWeight: 720, color: index === 1 ? colors.acid : colors.white}}>{metric.value}</div>
            <div style={{fontFamily: fonts.mono, fontSize: 7, letterSpacing: 0.75, color: "rgba(255,255,255,0.55)", marginTop: 3}}>{metric.label.toUpperCase()}</div>
          </div>
        ))}
      </div>
      <div style={{height: 41, borderTop: "1px solid rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 27px", fontFamily: fonts.mono, fontSize: 7, letterSpacing: 0.8, color: "rgba(255,255,255,0.62)"}}>
        <span>{props.footerLeft.toUpperCase()}</span>
        <span style={{color: colors.acid}}>{props.footerRight.toUpperCase()}</span>
      </div>
    </div>
  </AbsoluteFill>
);

const Label: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = colors.blue}) => (
  <div style={{fontFamily: fonts.mono, fontSize: 8, fontWeight: 600, letterSpacing: 1.05, color, textTransform: "uppercase"}}>{children}</div>
);

const FileTile: React.FC<{label: string; color: string; dark?: boolean}> = ({label, color, dark = false}) => (
  <div style={{width: 44, height: 59, borderRadius: 7, background: color, border: `1.5px solid ${colors.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.mono, fontSize: 8, fontWeight: 600, color: dark ? colors.ink : colors.white}}>{label}</div>
);

export const SplitEngineCanvas: React.FC<CanvasProps> = ({manualFrame, ...props}) => {
  const liveFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const frame = manualFrame ?? liveFrame;
  const active = getActiveIndex(frame);
  const scan = interpolate((frame % (2 * fps)) / (2 * fps), [0, 1], [0, 244]);

  const stepCard = (index: number, compact = false) => {
    const step = props.steps[index];
    const focus = getFocus(frame, index);
    const visited = index <= active;
    return (
      <div
        key={step.title}
        style={{
          position: "relative",
          minHeight: compact ? 118 : 151,
          boxSizing: "border-box",
          border: `1.5px solid ${focus > 0.35 ? colors.orange : visited ? colors.ink : colors.line}`,
          borderRadius: 13,
          background: colors.white,
          padding: compact ? 14 : 16,
          opacity: visited ? 1 : 0.3,
          boxShadow: focus > 0.65 ? `5px 5px 0 ${colors.ink}` : "none",
        }}
      >
        <Label color={focus > 0.35 ? colors.orange : colors.blue}>{step.phase}</Label>
        <div style={{fontFamily: fonts.display, fontSize: compact ? 19 : 22, fontWeight: 730, lineHeight: 1.02, letterSpacing: -0.45, marginTop: 5}}>{step.title}</div>
        <div style={{fontFamily: fonts.body, fontSize: compact ? 10.5 : 11.5, lineHeight: 1.25, color: colors.muted, marginTop: 7}}>{step.description}</div>
        <div style={{position: "absolute", right: 9, bottom: 9, padding: "4px 6px", borderRadius: 5, background: colors.ink, color: colors.acid, fontFamily: fonts.mono, fontSize: 7, fontWeight: 600}}>{step.output.toUpperCase()}</div>
      </div>
    );
  };

  return (
    <Shell props={props} layoutLabel="B · Split Engine">
      <div style={{position: "absolute", left: 38, right: 38, top: 231, bottom: 152, display: "grid", gridTemplateColumns: "205px 292px 195px", gap: 16}}>
        <div>
          <Label color={colors.orange}>Raw material</Label>
          <div style={{display: "flex", flexDirection: "column", gap: 13, marginTop: 10}}>{stepCard(0)}{stepCard(1)}</div>
          <div style={{marginTop: 15, border: `1px dashed ${colors.ink}`, borderRadius: 10, padding: 11, display: "flex", flexWrap: "wrap", gap: 6}}>
            {props.inputTags.map((tag, index) => <span key={tag} style={{borderRadius: 999, background: index === 1 ? colors.sky : colors.paper, border: `1px solid ${colors.ink}`, padding: "5px 7px", fontFamily: fonts.mono, fontSize: 7, fontWeight: 600}}>{tag.toUpperCase()}</span>)}
          </div>
        </div>
        <div style={{position: "relative", borderRadius: 18, background: colors.navy, padding: 17, color: colors.white, overflow: "hidden"}}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <Label color={colors.acid}>Automation engine</Label>
            <div style={{width: 9, height: 9, borderRadius: "50%", background: colors.orange}} />
          </div>
          <div style={{marginTop: 16, borderRadius: 11, border: "1px solid #304664", background: "#142743", padding: 12}}>
            <div style={{display: "flex", gap: 6}}>{[colors.orange, colors.yellow, colors.blue].map((color) => <span key={color} style={{width: 7, height: 7, borderRadius: "50%", background: color}} />)}</div>
            {["SOURCE → STORY", "LAYOUT → MOTION", "CHECK → EXPORT"].map((line, index) => <div key={line} style={{marginTop: 10, borderRadius: 5, background: index === active - 2 ? "#294D7F" : "#1A3458", padding: "8px 9px", fontFamily: fonts.mono, fontSize: 8, color: index === 1 ? colors.acid : colors.sky}}>{line}</div>)}
          </div>
          <div style={{display: "flex", flexDirection: "column", gap: 13, marginTop: 15}}>{stepCard(2, true)}{stepCard(3, true)}</div>
          <div style={{position: "absolute", left: 0, top: scan, width: "100%", height: 2, background: colors.orange, opacity: 0.7}} />
        </div>
        <div>
          <Label color={colors.blue}>Post pack</Label>
          <div style={{marginTop: 10}}>{stepCard(4)}</div>
          <div style={{marginTop: 17, borderRadius: 13, border: `1.5px solid ${colors.ink}`, background: colors.white, padding: 13}}>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9}}>
              <FileTile label="GIF" color={colors.orange} />
              <FileTile label="PNG" color={colors.blue} />
              <FileTile label="TXT" color={colors.yellow} dark />
              <FileTile label="{}" color={colors.acid} dark />
            </div>
            <div style={{marginTop: 13, borderRadius: 999, background: colors.ink, color: colors.acid, padding: "8px", textAlign: "center", fontFamily: fonts.mono, fontSize: 8, fontWeight: 600}}>{props.outputLabel.toUpperCase()}</div>
          </div>
        </div>
      </div>
    </Shell>
  );
};
const orbitPositions = [
  {x: 138, y: 342},
  {x: 554, y: 342},
  {x: 93, y: 604},
  {x: 310, y: 713},
  {x: 599, y: 604},
] as const;

export const OrbitMapCanvas: React.FC<CanvasProps> = ({manualFrame, ...props}) => {
  const liveFrame = useCurrentFrame();
  const frame = manualFrame ?? liveFrame;
  const active = getActiveIndex(frame);
  const center = {x: 400, y: 535};

  return (
    <Shell props={props} layoutLabel="C · Orbit Map">
      <svg width="800" height="1000" viewBox="0 0 800 1000" style={{position: "absolute", inset: 0}} aria-hidden="true">
        {orbitPositions.map((position, index) => {
          const nodeCenter = {x: position.x + 85, y: position.y + 58};
          const focus = getFocus(frame, index);
          const visited = index <= active;
          return (
            <g key={index}>
              <line x1={center.x} y1={center.y} x2={nodeCenter.x} y2={nodeCenter.y} stroke={visited ? colors.blue : colors.line} strokeWidth={focus > 0.25 ? 3 : 2} strokeDasharray="6 6" />
              {focus > 0.2 ? <circle cx={center.x + (nodeCenter.x - center.x) * focus} cy={center.y + (nodeCenter.y - center.y) * focus} r="5" fill={colors.orange} /> : null}
            </g>
          );
        })}
      </svg>
      <div style={{position: "absolute", left: 293, top: 426, width: 214, height: 214, borderRadius: "50%", background: colors.navy, color: colors.white, border: `8px solid ${colors.sky}`, boxShadow: `0 0 0 3px ${colors.blue}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24, boxSizing: "border-box"}}>
        <Label color={colors.acid}>Core system</Label>
        <div style={{fontFamily: fonts.display, fontSize: 29, fontWeight: 740, lineHeight: 0.95, marginTop: 9}}>AUTOMATE<br />THE POST</div>
        <div style={{fontFamily: fonts.mono, fontSize: 7.5, color: "#93A7C3", marginTop: 10}}>STORY + DESIGN + MOTION</div>
      </div>
      {props.steps.map((step, index) => {
        const position = orbitPositions[index];
        const focus = getFocus(frame, index);
        const visited = index <= active;
        return (
          <div key={step.title} style={{position: "absolute", left: position.x, top: position.y, width: 170, height: 116, boxSizing: "border-box", borderRadius: 16, border: `1.5px solid ${focus > 0.35 ? colors.orange : visited ? colors.ink : colors.line}`, background: colors.white, padding: 13, opacity: visited ? 1 : 0.3, boxShadow: focus > 0.6 ? `5px 5px 0 ${colors.ink}` : "none"}}>
            <div style={{display: "flex", justifyContent: "space-between"}}><Label color={focus > 0.35 ? colors.orange : colors.blue}>{step.phase}</Label><span style={{fontFamily: fonts.mono, fontSize: 8, fontWeight: 600}}>{String(index + 1).padStart(2, "0")}</span></div>
            <div style={{fontFamily: fonts.display, fontSize: 17, fontWeight: 720, lineHeight: 1.02, marginTop: 7}}>{step.title}</div>
            <div style={{fontFamily: fonts.body, fontSize: 9, lineHeight: 1.18, color: colors.muted, marginTop: 6}}>{step.description}</div>
          </div>
        );
      })}
    </Shell>
  );
};

export const EditorialStackCanvas: React.FC<CanvasProps> = ({manualFrame, ...props}) => {
  const liveFrame = useCurrentFrame();
  const frame = manualFrame ?? liveFrame;
  const active = getActiveIndex(frame);

  return (
    <Shell props={props} layoutLabel="D · Editorial Stack">
      <div style={{position: "absolute", left: 38, right: 38, top: 230, height: 195, borderRadius: 18, border: `1.5px solid ${getFocus(frame, 0) > 0.3 ? colors.orange : colors.ink}`, background: colors.sky, padding: 22, boxSizing: "border-box", boxShadow: getFocus(frame, 0) > 0.6 ? `6px 6px 0 ${colors.ink}` : "none"}}>
        <Label color={colors.orange}>{props.steps[0].phase} / Hero insight</Label>
        <div style={{fontFamily: fonts.display, fontSize: 36, fontWeight: 750, letterSpacing: -1.1, lineHeight: 0.95, width: 470, marginTop: 12}}>{props.steps[0].title}</div>
        <div style={{fontFamily: fonts.body, fontSize: 14, lineHeight: 1.3, color: colors.muted, width: 440, marginTop: 12}}>{props.steps[0].description}</div>
        <div style={{position: "absolute", right: 24, top: 22, width: 195, height: 145, borderRadius: 13, border: `1.5px solid ${colors.ink}`, background: colors.white, padding: 17, boxSizing: "border-box"}}>
          <div style={{height: 77, display: "flex", alignItems: "end", gap: 10}}>
            {[42, 63, 50, 84].map((height, index) => <div key={height} style={{width: 25, height, borderRadius: "5px 5px 0 0", background: index === 3 ? colors.orange : index === 1 ? colors.blue : colors.line}} />)}
          </div>
          <div style={{fontFamily: fonts.mono, fontSize: 8, fontWeight: 600, marginTop: 12}}>RAW IDEA → POST</div>
        </div>
      </div>
      <div style={{position: "absolute", left: 38, right: 38, top: 443, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14}}>
        {props.steps.slice(1).map((step, sliceIndex) => {
          const index = sliceIndex + 1;
          const focus = getFocus(frame, index);
          const visited = index <= active;
          return (
            <div key={step.title} style={{height: 173, boxSizing: "border-box", borderRadius: 15, border: `1.5px solid ${focus > 0.35 ? colors.orange : visited ? colors.ink : colors.line}`, background: colors.white, padding: 17, opacity: visited ? 1 : 0.3, boxShadow: focus > 0.6 ? `5px 5px 0 ${colors.ink}` : "none"}}>
              <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <div style={{width: 34, height: 34, borderRadius: 8, background: [colors.orange, colors.yellow, colors.blue, colors.acid][sliceIndex], border: `1.5px solid ${colors.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.mono, fontSize: 10, fontWeight: 600}}>{index + 1}</div>
                <Label color={focus > 0.35 ? colors.orange : colors.blue}>{step.phase}</Label>
              </div>
              <div style={{fontFamily: fonts.display, fontSize: 22, fontWeight: 730, lineHeight: 1.02, marginTop: 13}}>{step.title}</div>
              <div style={{fontFamily: fonts.body, fontSize: 11, lineHeight: 1.22, color: colors.muted, marginTop: 8}}>{step.description}</div>
              <div style={{marginTop: 10, width: `${42 + sliceIndex * 13}%`, height: 7, borderRadius: 999, background: focus > 0.35 ? colors.orange : colors.blue}} />
            </div>
          );
        })}
      </div>
    </Shell>
  );
};
