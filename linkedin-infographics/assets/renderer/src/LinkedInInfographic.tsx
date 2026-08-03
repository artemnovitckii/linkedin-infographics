import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {fonts} from "./fonts";
import type {InfographicProps} from "./schema";
import {EditorialStackCanvas, OrbitMapCanvas, SplitEngineCanvas} from "./AlternativeLayouts";

const colors = {
  paper: "#F1EEE6",
  ink: "#111827",
  navy: "#0B1930",
  blue: "#216CFF",
  orange: "#FF5B35",
  acid: "#D9F45B",
  yellow: "#FFD84D",
  sky: "#BEE3FF",
  muted: "#667085",
  line: "#CEC8BC",
  white: "#FFFDF8",
} as const;

const cardTop = 322;
const cardHeight = 96;
const cardGap = 10;
const cardLeft = 86;
const cardWidth = 676;
const railX = 51;
const nodeYs = Array.from({length: 5}, (_, index) => cardTop + index * (cardHeight + cardGap) + cardHeight / 2);
const phaseFrames = 27;
const holdFrames = 18;
const timelineStart = 7;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const claudePath = "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z";

const openAIPath = "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z";

const AgentMark: React.FC<{tool: "claude-code" | "codex"}> = ({tool}) => (
  <div
    style={{
      width: 140,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      gap: 10,
      border: `1px solid ${colors.ink}`,
      borderRadius: 9,
      background: tool === "claude-code" ? "#FFF3EE" : colors.white,
      padding: "7px 9px",
      color: colors.ink,
      whiteSpace: "nowrap",
    }}
  >
    <svg aria-hidden="true" width="31" height="31" viewBox="0 0 24 24">
      <path d={tool === "claude-code" ? claudePath : openAIPath} fill={tool === "claude-code" ? "#D97757" : colors.ink} />
    </svg>
    <span style={{fontFamily: fonts.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: 0.1}}>
      {tool === "claude-code" ? "CLAUDE CODE" : "CODEX"}
    </span>
  </div>
);

const CompatibilityLockup: React.FC<{compatibility: NonNullable<InfographicProps["compatibility"]>}> = ({
  compatibility,
}) => (
  <div
    style={{
      position: "absolute",
      right: 38,
      top: 61,
      width: 166,
      height: 158,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      border: `1.5px solid ${colors.ink}`,
      borderRadius: 13,
      background: colors.acid,
      padding: "11px 13px",
      boxShadow: `5px 5px 0 ${colors.ink}`,
    }}
  >
    <span style={{fontFamily: fonts.mono, fontSize: 8.5, fontWeight: 700, color: colors.ink, letterSpacing: 1.1}}>
      {compatibility.label.toUpperCase()}
    </span>
    {compatibility.tools.map((tool) => <AgentMark key={tool} tool={tool} />)}
  </div>
);

const CreatorRail: React.FC<{author: NonNullable<InfographicProps["author"]>}> = ({author}) => (
  <div style={{display: "flex", alignItems: "center", minWidth: 410}}>
    <div
      style={{
        width: 33,
        height: 33,
        borderRadius: 999,
        overflow: "hidden",
        border: `2px solid ${colors.orange}`,
        background: colors.white,
        boxShadow: `0 0 0 2px rgba(255,255,255,0.14)`,
        flexShrink: 0,
      }}
    >
      <Img
        src={staticFile(author.avatar)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 32%",
          transform: "scale(1.08)",
        }}
      />
    </div>
    <div style={{marginLeft: 9, display: "flex", alignItems: "center", whiteSpace: "nowrap"}}>
      <span style={{fontFamily: fonts.display, fontSize: 12, fontWeight: 720, color: colors.white, letterSpacing: -0.15}}>
        {author.name}
      </span>
      <span style={{width: 4, height: 4, borderRadius: 999, background: colors.orange, margin: "0 9px"}} />
      <span style={{fontFamily: fonts.mono, fontSize: 8.5, fontWeight: 650, letterSpacing: 0.55, color: colors.acid}}>
        {author.label.toUpperCase()} · {author.plug.toUpperCase()}
      </span>
    </div>
  </div>
);

const getTimeline = (frame: number) => {
  const elapsed = Math.max(0, frame - timelineStart);
  const activeIndex = Math.min(4, Math.floor(elapsed / phaseFrames));
  const localFrame = elapsed - activeIndex * phaseFrames;
  const nextIndex = Math.min(4, activeIndex + 1);
  const travel = activeIndex === 4
    ? 0
    : interpolate(localFrame, [holdFrames, phaseFrames - 1], [0, 1], {
        easing: Easing.inOut(Easing.quad),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  return {
    activeIndex,
    dotY: nodeYs[activeIndex] + (nodeYs[nextIndex] - nodeYs[activeIndex]) * travel,
  };
};

const Starburst: React.FC<{x: number; y: number; color: string; scale?: number}> = ({
  x,
  y,
  color,
  scale = 1,
}) => (
  <svg
    aria-hidden="true"
    width={58 * scale}
    height={58 * scale}
    viewBox="0 0 58 58"
    style={{position: "absolute", left: x, top: y}}
  >
    {Array.from({length: 16}).map((_, index) => (
      <line
        key={index}
        x1="29"
        y1="5"
        x2="29"
        y2="21"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        transform={`rotate(${index * 22.5} 29 29)`}
      />
    ))}
  </svg>
);

const IllustrationFrame: React.FC<{children: React.ReactNode; activity: number}> = ({children, activity}) => (
  <div
    style={{
      width: 126,
      height: 72,
      borderRadius: 10,
      border: `1px solid ${interpolateColors(activity, [0, 1], [colors.line, colors.orange])}`,
      background: colors.paper,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      boxShadow: activity > 0.7 ? "4px 4px 0 rgba(17,24,39,0.10)" : "none",
    }}
  >
    {children}
  </div>
);

const StepIllustration: React.FC<{
  kind: InfographicProps["steps"][number]["visual"];
  activity: number;
  frame: number;
  fps: number;
}> = ({kind, activity, frame, fps}) => {
  const breathe = (Math.sin((frame / fps) * Math.PI * 2) + 1) / 2;
  const motion = activity * breathe;

  if (kind === "source") {
    return (
      <IllustrationFrame activity={activity}>
        <svg width="116" height="64" viewBox="0 0 116 64" aria-hidden="true">
          <rect x="7" y="9" width="26" height="35" rx="4" fill={colors.white} stroke={colors.ink} strokeWidth="1.5" />
          <line x1="13" y1="17" x2="27" y2="17" stroke={colors.blue} strokeWidth="2" />
          <line x1="13" y1="23" x2="24" y2="23" stroke={colors.line} strokeWidth="2" />
          <line x1="13" y1="29" x2="27" y2="29" stroke={colors.line} strokeWidth="2" />
          <circle cx="45" cy="19" r="10" fill={colors.sky} stroke={colors.ink} strokeWidth="1.5" />
          <path d="M42 14L50 19L42 24Z" fill={colors.blue} />
          <rect x="37" y="37" width="21" height="15" rx="4" fill={colors.yellow} stroke={colors.ink} strokeWidth="1.5" />
          <path d="M65 13L80 32L65 51" fill="none" stroke={colors.orange} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M61 32H82" stroke={colors.orange} strokeWidth="2.5" />
          <rect
            x={86 + motion * 3}
            y={19 - motion * 2}
            width="23"
            height="27"
            rx="5"
            fill={colors.ink}
          />
          <circle cx={97.5 + motion * 3} cy={28 - motion * 2} r="3" fill={colors.acid} />
          <line x1={92 + motion * 3} y1={36 - motion * 2} x2={103 + motion * 3} y2={36 - motion * 2} stroke={colors.white} strokeWidth="2" />
        </svg>
      </IllustrationFrame>
    );
  }

  if (kind === "story") {
    return (
      <IllustrationFrame activity={activity}>
        <svg width="116" height="64" viewBox="0 0 116 64" aria-hidden="true">
          <rect x="8" y="8" width="100" height="48" rx="7" fill={colors.white} stroke={colors.ink} strokeWidth="1.5" />
          <rect x="15" y="15" width={43 + motion * 17} height="7" rx="2" fill={colors.orange} />
          {[30, 40, 50].map((y, index) => (
            <React.Fragment key={y}>
              <circle cx="19" cy={y} r="4" fill={index === 0 ? colors.blue : colors.sky} />
              <text x="19" y={y + 2.5} textAnchor="middle" fontFamily={fonts.mono} fontSize="5" fontWeight="600" fill={colors.ink}>
                {index + 1}
              </text>
              <line x1="27" y1={y} x2={85 - index * 8} y2={y} stroke={colors.ink} strokeWidth="2" opacity="0.65" />
            </React.Fragment>
          ))}
          <path d="M91 29L101 34L91 39Z" fill={colors.acid} stroke={colors.ink} strokeWidth="1.2" />
        </svg>
      </IllustrationFrame>
    );
  }

  if (kind === "layout") {
    const selectedStroke = interpolateColors(activity, [0, 1], [colors.ink, colors.orange]);
    const checkScale = 0.82 + motion * 0.18;
    const cells = [
      {label: "A", x: 5, y: 3, selected: true},
      {label: "B", x: 60, y: 3, selected: false},
      {label: "C", x: 5, y: 30, selected: false},
      {label: "D", x: 60, y: 30, selected: false},
    ] as const;

    return (
      <IllustrationFrame activity={activity}>
        <svg width="116" height="64" viewBox="0 0 116 64" aria-hidden="true">
          {cells.map((cell) => (
            <g key={cell.label}>
              <rect
                x={cell.x}
                y={cell.y}
                width="51"
                height="25"
                rx="4"
                fill={cell.selected ? colors.acid : colors.white}
                stroke={cell.selected ? selectedStroke : colors.line}
                strokeWidth={cell.selected ? 1.8 : 1.1}
              />
              <rect x={cell.x + 4} y={cell.y + 4} width="9" height="9" rx="2.5" fill={cell.selected ? colors.orange : colors.sky} />
              <text
                x={cell.x + 8.5}
                y={cell.y + 11}
                textAnchor="middle"
                fontFamily={fonts.mono}
                fontSize="5.5"
                fontWeight="700"
                fill={cell.selected ? colors.white : colors.ink}
              >
                {cell.label}
              </text>

              {cell.label === "A" ? (
                <>
                  <line x1={cell.x + 19} y1={cell.y + 5} x2={cell.x + 19} y2={cell.y + 20} stroke={colors.blue} strokeWidth="1.4" />
                  {[6, 11.5, 17].map((offset, index) => (
                    <g key={offset}>
                      <circle cx={cell.x + 19} cy={cell.y + offset} r="1.5" fill={index === 0 ? colors.orange : colors.blue} />
                      <rect x={cell.x + 23} y={cell.y + offset - 1.7} width={index === 1 ? 17 : 21} height="3.4" rx="1" fill={index === 0 ? colors.orange : colors.ink} opacity={index === 0 ? 1 : 0.65} />
                    </g>
                  ))}
                  <g transform={`translate(${cell.x + 45} ${cell.y + 4}) scale(${checkScale})`}>
                    <circle cx="0" cy="0" r="4" fill={colors.ink} />
                    <path d="M-2 0L-0.3 1.8L2.5-1.7" fill="none" stroke={colors.acid} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </>
              ) : null}

              {cell.label === "B" ? (
                <>
                  <rect x={cell.x + 18} y={cell.y + 7} width="5" height="4" rx="1" fill={colors.sky} />
                  <rect x={cell.x + 18} y={cell.y + 15} width="5" height="4" rx="1" fill={colors.sky} />
                  <path d={`M${cell.x + 24} ${cell.y + 9}H${cell.x + 29}M${cell.x + 24} ${cell.y + 17}H${cell.x + 29}`} stroke={colors.ink} strokeWidth="1" />
                  <rect x={cell.x + 29} y={cell.y + 7} width="9" height="12" rx="2" fill={colors.navy} />
                  <path d={`M${cell.x + 39} ${cell.y + 13}H${cell.x + 43}`} stroke={colors.orange} strokeWidth="1.2" />
                  <rect x={cell.x + 43} y={cell.y + 9} width="4" height="8" rx="1" fill={colors.orange} />
                </>
              ) : null}

              {cell.label === "C" ? (
                <>
                  <circle cx={cell.x + 33} cy={cell.y + 13} r="4" fill={colors.orange} />
                  {[[-8, 0], [8, 0], [0, -7], [0, 7]].map(([dx, dy]) => (
                    <g key={`${dx}-${dy}`}>
                      <line x1={cell.x + 33} y1={cell.y + 13} x2={cell.x + 33 + dx} y2={cell.y + 13 + dy} stroke={colors.blue} strokeWidth="0.9" />
                      <circle cx={cell.x + 33 + dx} cy={cell.y + 13 + dy} r="2" fill={colors.sky} stroke={colors.ink} strokeWidth="0.6" />
                    </g>
                  ))}
                </>
              ) : null}

              {cell.label === "D" ? (
                <>
                  <rect x={cell.x + 18} y={cell.y + 5} width="28" height="7" rx="1.5" fill={colors.orange} />
                  <rect x={cell.x + 18} y={cell.y + 15} width="12.5" height="6" rx="1" fill={colors.sky} />
                  <rect x={cell.x + 33.5} y={cell.y + 15} width="12.5" height="6" rx="1" fill={colors.yellow} />
                </>
              ) : null}
            </g>
          ))}
        </svg>
      </IllustrationFrame>
    );
  }

  if (kind === "template") {
    return (
      <IllustrationFrame activity={activity}>
        <svg width="116" height="64" viewBox="0 0 116 64" aria-hidden="true">
          <rect x="10" y="13" width="30" height="38" rx="5" fill={colors.sky} stroke={colors.ink} strokeWidth="1.5" transform="rotate(-7 25 32)" />
          <rect x="43" y="8" width="30" height="43" rx="5" fill={colors.yellow} stroke={colors.ink} strokeWidth="1.5" />
          <rect x="76" y="13" width="30" height="38" rx="5" fill={colors.white} stroke={colors.ink} strokeWidth="1.5" transform="rotate(7 91 32)" />
          <rect x="49" y="14" width="18" height="5" rx="2" fill={colors.orange} />
          {[25, 31, 37].map((y, index) => (
            <line key={y} x1="49" y1={y} x2={66 - index * 2} y2={y} stroke={colors.ink} strokeWidth="1.5" opacity="0.65" />
          ))}
          <rect x={48 - motion * 2} y={46 - motion * 2} width={20 + motion * 4} height="6" rx="3" fill={colors.blue} />
        </svg>
      </IllustrationFrame>
    );
  }

  if (kind === "motion") {
    const playhead = 22 + motion * 68;
    return (
      <IllustrationFrame activity={activity}>
        <svg width="116" height="64" viewBox="0 0 116 64" aria-hidden="true">
          <rect x="8" y="9" width="100" height="46" rx="7" fill={colors.navy} />
          <path d="M18 38C32 38 30 20 45 20C59 20 61 36 76 27C86 21 91 18 100 19" fill="none" stroke={colors.sky} strokeWidth="2" />
          {[22, 45, 76, 99].map((x, index) => (
            <circle key={x} cx={x} cy={index === 0 ? 38 : index === 1 ? 20 : index === 2 ? 27 : 19} r="3" fill={index === 1 ? colors.acid : colors.blue} />
          ))}
          <line x1={playhead} y1="14" x2={playhead} y2="49" stroke={colors.orange} strokeWidth="2" />
          <circle cx={playhead} cy="49" r="3" fill={colors.orange} />
        </svg>
      </IllustrationFrame>
    );
  }

  return (
    <IllustrationFrame activity={activity}>
      <svg width="116" height="64" viewBox="0 0 116 64" aria-hidden="true">
        {[
          {x: 8, y: 14, label: "GIF", fill: colors.orange},
          {x: 34, y: 8, label: "PNG", fill: colors.blue},
          {x: 60, y: 14, label: "TXT", fill: colors.yellow},
          {x: 86, y: 8, label: "{}", fill: colors.acid},
        ].map((file, index) => (
          <g key={file.label} transform={`translate(0 ${activity > 0.65 ? -motion * (index % 2 === 0 ? 3 : 5) : 0})`}>
            <rect x={file.x} y={file.y} width="23" height="34" rx="4" fill={file.fill} stroke={colors.ink} strokeWidth="1.3" />
            <text x={file.x + 11.5} y={file.y + 20} textAnchor="middle" fontFamily={fonts.mono} fontSize="6" fontWeight="600" fill={index === 2 || index === 3 ? colors.ink : colors.white}>
              {file.label}
            </text>
          </g>
        ))}
        <circle cx="99" cy="49" r="10" fill={colors.ink} />
        <path d="M94 49L98 53L105 45" fill="none" stroke={colors.acid} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </IllustrationFrame>
  );
};

const EngineStrip: React.FC<Pick<InfographicProps, "inputLabel" | "inputTags" | "outputLabel">> = ({
  inputLabel,
  inputTags,
  outputLabel,
}) => (
  <div
    style={{
      position: "absolute",
      left: 38,
      right: 38,
      top: 236,
      height: 66,
      display: "flex",
      alignItems: "center",
      border: `1.5px solid ${colors.ink}`,
      borderRadius: 13,
      background: colors.white,
      boxShadow: `5px 5px 0 ${colors.ink}`,
      padding: "0 14px",
    }}
  >
    <div style={{width: 82}}>
      <div style={{fontFamily: fonts.mono, fontSize: 8, color: colors.orange, letterSpacing: 1, fontWeight: 600}}>
        {inputLabel.toUpperCase()}
      </div>
      <div style={{fontFamily: fonts.display, fontSize: 16, fontWeight: 720, marginTop: 3}}>MESSY IN</div>
    </div>
    <div style={{display: "flex", gap: 5}}>
      {inputTags.map((tag, index) => (
        <span
          key={tag}
          style={{
            border: `1px solid ${colors.ink}`,
            borderRadius: 999,
            background: index === 1 ? colors.sky : colors.white,
            padding: "5px 8px 4px",
            fontFamily: fonts.mono,
            fontSize: 7.5,
            fontWeight: 600,
          }}
        >
          {tag.toUpperCase()}
        </span>
      ))}
    </div>
    <div style={{display: "flex", alignItems: "center", flex: 1, margin: "0 12px"}}>
      <div style={{height: 1, background: colors.line, flex: 1}} />
      <span style={{color: colors.orange, fontFamily: fonts.mono, fontSize: 17, margin: "0 8px"}}>→</span>
      <div
        style={{
          background: colors.navy,
          color: colors.acid,
          borderRadius: 7,
          padding: "8px 10px",
          fontFamily: fonts.mono,
          fontSize: 8,
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        LINKEDIN-INFOGRAPHICS SKILL
      </div>
      <span style={{color: colors.orange, fontFamily: fonts.mono, fontSize: 17, margin: "0 8px"}}>→</span>
      <div style={{height: 1, background: colors.line, flex: 1}} />
    </div>
    <div
      style={{
        borderRadius: 999,
        background: colors.orange,
        color: colors.white,
        padding: "8px 10px",
        fontFamily: fonts.mono,
        fontSize: 8,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {outputLabel.toUpperCase()}
    </div>
  </div>
);

const StepCard: React.FC<{
  step: InfographicProps["steps"][number];
  index: number;
  currentIndex: number;
  dotY: number;
  frame: number;
  fps: number;
}> = ({step, index, currentIndex, dotY, frame, fps}) => {
  const top = cardTop + index * (cardHeight + cardGap);
  const distance = Math.abs(dotY - nodeYs[index]);
  const proximity = clamp(1 - distance / 78);
  const visited = index <= currentIndex;
  const opacity = visited ? 1 : interpolate(proximity, [0, 1], [0.34, 1]);
  const borderColor = interpolateColors(proximity, [0, 1], [colors.line, colors.orange]);

  return (
    <div
      style={{
        position: "absolute",
        left: cardLeft,
        top,
        width: cardWidth,
        height: cardHeight,
        boxSizing: "border-box",
        border: `1.5px solid ${visited && proximity < 0.2 ? colors.ink : borderColor}`,
        borderRadius: 14,
        background: colors.white,
        opacity,
        boxShadow: proximity > 0.75 ? `5px 5px 0 ${colors.ink}` : "none",
        padding: "13px 156px 12px 20px",
      }}
    >
      <div
        style={{
          color: proximity > 0.6 ? colors.orange : colors.blue,
          fontFamily: fonts.mono,
          fontSize: 8,
          fontWeight: 600,
          letterSpacing: 1.1,
          textTransform: "uppercase",
        }}
      >
        {step.phase}
      </div>
      <div
        style={{
          marginTop: 3,
          color: colors.ink,
          fontFamily: fonts.display,
          fontSize: 22,
          fontWeight: 730,
          letterSpacing: -0.55,
          lineHeight: 1,
        }}
      >
        {step.title}
      </div>
      <div
        style={{
          width: 435,
          marginTop: 5,
          color: colors.muted,
          fontFamily: fonts.body,
          fontSize: 11.5,
          fontWeight: 500,
          lineHeight: 1.2,
        }}
      >
        {step.description}
      </div>
      <div style={{position: "absolute", right: 14, top: 12}}>
        <StepIllustration kind={step.visual} activity={proximity} frame={frame} fps={fps} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 17,
          bottom: 8,
          borderRadius: 5,
          background: proximity > 0.65 ? colors.ink : "rgba(17,24,39,0.07)",
          color: proximity > 0.65 ? colors.acid : colors.ink,
          padding: "4px 6px",
          fontFamily: fonts.mono,
          fontSize: 7,
          fontWeight: 600,
          letterSpacing: 0.2,
        }}
      >
        {step.output.toUpperCase()}
      </div>
    </div>
  );
};

const MotionRail: React.FC<{dotY: number; currentIndex: number; frame: number; fps: number}> = ({
  dotY,
  currentIndex,
  frame,
  fps,
}) => {
  const pulse = interpolate(Math.sin((frame / fps) * Math.PI * 2), [-1, 1], [0.88, 1.15]);

  return (
    <svg
      aria-hidden="true"
      width="800"
      height="1000"
      viewBox="0 0 800 1000"
      style={{position: "absolute", inset: 0, pointerEvents: "none"}}
    >
      <line x1={railX} y1={nodeYs[0]} x2={railX} y2={nodeYs[4]} stroke={colors.line} strokeWidth="3" />
      <line x1={railX} y1={nodeYs[0]} x2={railX} y2={dotY} stroke={colors.blue} strokeWidth="3" />
      {nodeYs.map((y, index) => {
        const visited = index <= currentIndex;
        const current = Math.abs(dotY - y) < 5;
        return (
          <g key={y}>
            <line x1={railX + 12} y1={y} x2={cardLeft - 5} y2={y} stroke={visited ? colors.blue : colors.line} strokeWidth="2" />
            <circle cx={railX} cy={y} r="12" fill={current ? colors.orange : visited ? colors.blue : colors.paper} stroke={visited ? colors.blue : colors.line} strokeWidth="2" />
            <text x={railX} y={y + 3} textAnchor="middle" fontFamily={fonts.mono} fontSize="8" fontWeight="600" fill={visited ? colors.white : colors.muted}>
              {index + 1}
            </text>
          </g>
        );
      })}
      <circle cx={railX} cy={dotY} r={10 * pulse} fill={colors.orange} opacity="0.18" />
      <circle cx={railX} cy={dotY} r="4.5" fill={colors.orange} stroke={colors.white} strokeWidth="2" />
    </svg>
  );
};

const InfographicCanvas: React.FC<InfographicProps & {manualFrame?: number}> = ({manualFrame, ...props}) => {
  const currentFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const frame = manualFrame ?? currentFrame;
  const {activeIndex, dotY} = getTimeline(frame);

  return (
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
      <div
        style={{
          position: "absolute",
          left: 38,
          top: 30,
          display: "flex",
          alignItems: "center",
          gap: 10,
          color: colors.blue,
          fontFamily: fonts.mono,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 1.3,
        }}
      >
        <span style={{width: 9, height: 9, background: colors.orange, borderRadius: 2}} />
        {props.eyebrow.toUpperCase()}
      </div>
      {props.compatibility ? <CompatibilityLockup compatibility={props.compatibility} /> : null}

      <div style={{position: "absolute", left: 38, top: 73}}>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 56,
            fontWeight: 760,
            letterSpacing: -2.5,
            lineHeight: 0.9,
          }}
        >
          {props.titleLead}
        </div>
        <div
          style={{
            marginTop: 5,
            color: colors.orange,
            fontFamily: fonts.display,
            fontSize: 56,
            fontWeight: 760,
            letterSpacing: -2.5,
            lineHeight: 0.9,
          }}
        >
          {props.titleAccent}
        </div>
        <div
          style={{
            marginTop: 13,
            color: colors.muted,
            fontFamily: fonts.body,
            fontSize: 15,
            fontWeight: 560,
          }}
        >
          {props.subtitle}
        </div>
      </div>
      <EngineStrip inputLabel={props.inputLabel} inputTags={props.inputTags} outputLabel={props.outputLabel} />
      {props.steps.map((step, index) => (
        <StepCard
          key={`${step.phase}-${step.title}`}
          step={step}
          index={index}
          currentIndex={activeIndex}
          dotY={dotY}
          frame={frame}
          fps={fps}
        />
      ))}
      <MotionRail dotY={dotY} currentIndex={activeIndex} frame={frame} fps={fps} />

      {props.footerMode === "conversion" ? (
        <div
          style={{
            position: "absolute",
            left: 17,
            right: 17,
            bottom: 17,
            height: props.author ? 110 : 100,
            borderRadius: "0 0 19px 19px",
            background: colors.navy,
            color: colors.white,
            overflow: "hidden",
          }}
        >
          <div style={{display: "flex", height: 67, alignItems: "center", padding: "0 28px", gap: 24}}>
            <div style={{width: 245}}>
              <div style={{fontFamily: fonts.mono, fontSize: 7.5, fontWeight: 650, letterSpacing: 1, color: "rgba(255,255,255,0.58)"}}>
                {props.footerLeft.toUpperCase()}
              </div>
              <div style={{fontFamily: fonts.display, fontSize: 25, fontWeight: 740, color: colors.white, marginTop: 2, letterSpacing: -0.5}}>
                {props.cta}
              </div>
            </div>
            <div style={{flex: 1}}>
              <div style={{fontFamily: fonts.mono, fontSize: 7, fontWeight: 650, letterSpacing: 0.9, color: colors.acid, marginBottom: 4}}>
                GET THE SKILL
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 7,
                  background: colors.acid,
                  color: colors.ink,
                  padding: "7px 10px",
                  fontFamily: fonts.mono,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 0.25,
                }}
              >
                {props.footerRight}
              </div>
            </div>
            <div
              style={{
                width: 43,
                height: 43,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: colors.orange,
                color: colors.white,
                fontFamily: fonts.mono,
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              →
            </div>
          </div>
          <div
            style={{
              height: props.author ? 43 : 33,
              borderTop: "1px solid rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 28px",
              fontFamily: fonts.mono,
              fontSize: 7.5,
              letterSpacing: 0.8,
              color: "rgba(255,255,255,0.60)",
            }}
          >
            {props.author ? <CreatorRail author={props.author} /> : <span>{props.metrics.map((metric) => metric.value).join("  ·  ")}</span>}
            <span>{props.author ? props.metrics.map((metric) => metric.value).join("  ·  ") : props.metrics[2].label.toUpperCase()}</span>
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            left: 17,
            right: 17,
            bottom: 17,
            height: 125,
            borderRadius: "0 0 19px 19px",
            background: colors.navy,
            color: colors.white,
            overflow: "hidden",
          }}
        >
          <Starburst x={714} y={4} color={colors.orange} scale={0.9} />
          <div style={{display: "flex", height: 82, alignItems: "center", padding: "0 28px"}}>
            {props.metrics.map((metric, index) => (
              <div
                key={metric.value}
                style={{
                  width: index === 2 ? 210 : 220,
                  borderLeft: index === 0 ? "none" : "1px solid rgba(255,255,255,0.18)",
                  paddingLeft: index === 0 ? 0 : 23,
                }}
              >
                <div style={{fontFamily: fonts.display, fontSize: 22, fontWeight: 720, color: index === 1 ? colors.acid : colors.white}}>
                  {metric.value}
                </div>
                <div style={{fontFamily: fonts.mono, fontSize: 7.5, letterSpacing: 0.8, color: "rgba(255,255,255,0.58)", marginTop: 4}}>
                  {metric.label.toUpperCase()}
                </div>
              </div>
            ))}
            <div
              style={{
                marginLeft: "auto",
                background: colors.orange,
                borderRadius: 999,
                padding: "8px 10px",
                fontFamily: fonts.mono,
                fontSize: 8,
                fontWeight: 600,
              }}
            >
              {props.cta.toUpperCase()}
            </div>
          </div>
          <div
            style={{
              height: 43,
              borderTop: "1px solid rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 28px",
              fontFamily: fonts.mono,
              fontSize: 7.5,
              letterSpacing: 0.9,
              color: "rgba(255,255,255,0.62)",
            }}
          >
            <span>{props.footerLeft.toUpperCase()}</span>
            <span style={{color: colors.acid}}>{props.footerRight.toUpperCase()}</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const renderSelectedLayout = (props: InfographicProps, manualFrame?: number) => {
  if (props.layout === "split-engine") return <SplitEngineCanvas {...props} manualFrame={manualFrame} />;
  if (props.layout === "orbit-map") return <OrbitMapCanvas {...props} manualFrame={manualFrame} />;
  if (props.layout === "editorial-stack") return <EditorialStackCanvas {...props} manualFrame={manualFrame} />;
  return <InfographicCanvas {...props} manualFrame={manualFrame} />;
};

export const LinkedInInfographic: React.FC<InfographicProps> = (props) => renderSelectedLayout(props);

export const LinkedInInfographicCover: React.FC<InfographicProps> = (props) => (
  <>{renderSelectedLayout(props, 141)}</>
);
