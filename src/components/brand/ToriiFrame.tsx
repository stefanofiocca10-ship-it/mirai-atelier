import { cn } from "@/lib/utils";

type ToriiVariant = "myojin" | "shinmei";

type Props = {
  children: React.ReactNode;
  variant?: ToriiVariant;
  className?: string;
  contentClassName?: string;
  /** Contenuto media a tutta area del vano (foto) */
  media?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

/* Palette flat (stile illustrazione vettoriale) — famiglia khaki Mirai */
const LIGHT = "#8c7656";
const DARK = "#5a4834";
const DEEP = "#3f3226";
const LINE = "#2b2118";
const PAPER = "#efebe4";

const outline = {
  stroke: LINE,
  strokeWidth: 1.4,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

/* —— Myōjin: kasagi svasato · shimaki · gakuzuka decorata · nuki · hashira ——
   Hashira = 3.25% (x 54–80 / 720–746) */
function MyojinLintel() {
  return (
    <svg
      viewBox="0 0 800 84"
      className="torii-lintel__img"
      aria-hidden
      focusable="false"
    >
      {/* Hashira (teste) con lato in ombra */}
      <rect x="54" y="44" width="26" height="40" fill={LIGHT} {...outline} />
      <rect x="70" y="44" width="10" height="40" fill={DARK} />
      <rect x="720" y="44" width="26" height="40" fill={LIGHT} {...outline} />
      <rect x="736" y="44" width="10" height="40" fill={DARK} />

      {/* Nuki — attraversa i pilastri, sporge oltre */}
      <rect x="38" y="58" width="724" height="11" fill={LIGHT} {...outline} />
      <rect x="38" y="65" width="724" height="4" fill={DARK} />
      {/* Kusabi */}
      <rect x="60" y="54" width="14" height="4" fill={DEEP} {...outline} />
      <rect x="60" y="69" width="14" height="4" fill={DEEP} {...outline} />
      <rect x="726" y="54" width="14" height="4" fill={DEEP} {...outline} />
      <rect x="726" y="69" width="14" height="4" fill={DEEP} {...outline} />

      {/* Shimaki — trave retta sotto il kasagi, tono scuro */}
      <rect x="62" y="33" width="676" height="12" fill={DARK} {...outline} />

      {/* Kasagi — trave superiore svasata alle estremità */}
      <path
        d="M10 12 Q 70 20 170 20 H 630 Q 730 20 790 12 L 794 24 Q 730 34 630 34 H 170 Q 70 34 6 24 Z"
        fill={LIGHT}
        {...outline}
      />
      <path
        d="M22 20 Q 80 27 170 27 H 630 Q 720 27 778 20 L 780 23 Q 720 31 630 31 H 170 Q 80 31 20 23 Z"
        fill={DARK}
      />

      {/* Gakuzuka — targa decorata tra shimaki e nuki */}
      <rect x="378" y="30" width="44" height="34" fill={DARK} {...outline} />
      <rect x="383" y="35" width="34" height="24" fill="none" stroke={LIGHT} strokeWidth="1.6" />
      <rect x="389" y="40" width="22" height="14" fill={PAPER} fillOpacity="0.85" {...outline} />
      <circle cx="385" cy="37" r="1.4" fill={LIGHT} />
      <circle cx="415" cy="37" r="1.4" fill={LIGHT} />
      <circle cx="385" cy="57" r="1.4" fill={LIGHT} />
      <circle cx="415" cy="57" r="1.4" fill={LIGHT} />
    </svg>
  );
}

/* —— Shinmei: linee rette, kasagi cilindrico, shimaki, nuki, hashira ——
   Hashira = 3% (x 56–80 / 720–744) */
function ShinmeiLintel() {
  return (
    <svg
      viewBox="0 0 800 68"
      className="torii-lintel__img"
      aria-hidden
      focusable="false"
    >
      <rect x="56" y="30" width="24" height="38" fill={LIGHT} {...outline} />
      <rect x="71" y="30" width="9" height="38" fill={DARK} />
      <rect x="720" y="30" width="24" height="38" fill={LIGHT} {...outline} />
      <rect x="735" y="30" width="9" height="38" fill={DARK} />

      {/* Nuki */}
      <rect x="40" y="44" width="720" height="10" fill={LIGHT} {...outline} />
      <rect x="40" y="50" width="720" height="4" fill={DARK} />
      <rect x="61" y="40" width="14" height="4" fill={DEEP} {...outline} />
      <rect x="61" y="54" width="14" height="4" fill={DEEP} {...outline} />
      <rect x="725" y="40" width="14" height="4" fill={DEEP} {...outline} />
      <rect x="725" y="54" width="14" height="4" fill={DEEP} {...outline} />

      {/* Shimaki — retto */}
      <rect x="64" y="20" width="672" height="10" fill={DARK} {...outline} />

      {/* Kasagi — cilindrico, dritto */}
      <rect x="14" y="6" width="772" height="14" rx="7" fill={LIGHT} {...outline} />
      <rect x="20" y="13" width="760" height="6" rx="3" fill={DARK} />
    </svg>
  );
}

/**
 * Portale torii Stile Mirai — flat vector, contorni scuri.
 * Myōjin = kasagi svasato + gakuzuka · Shinmei = linee rette senza gakuzuka.
 */
export function ToriiFrame({
  children,
  variant = "myojin",
  className,
  contentClassName,
  media = false,
  ...rest
}: Props) {
  return (
    <div
      className={cn(
        "torii",
        variant === "shinmei" ? "torii--shinmei" : "torii--myojin",
        media && "torii--media",
        className
      )}
      {...rest}
    >
      <div className="torii-lintel">
        {variant === "shinmei" ? <ShinmeiLintel /> : <MyojinLintel />}
      </div>

      <div className="torii-body">
        <span className="torii-hashira" aria-hidden>
          <span className="torii-base" />
        </span>
        <div
          className={cn(
            media ? "torii-opening torii-opening--media" : "torii-opening",
            contentClassName
          )}
        >
          {children}
        </div>
        <span className="torii-hashira" aria-hidden>
          <span className="torii-base" />
        </span>
      </div>
    </div>
  );
}
