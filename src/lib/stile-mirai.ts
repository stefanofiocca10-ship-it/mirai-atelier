/**
 * Stile Mirai — design system unico (sito + admin).
 *
 * Cornici: componente ToriiFrame (non bordi CSS).
 * - Myōjin: kasagi curvo + gakuzuka + nuki + hashira
 * - Shinmei: kasagi retto + nuki + hashira
 *
 * SVG lintel: public/brand/torii-lintel-myojin.svg | torii-lintel-shinmei.svg
 */

export const MIRAI = {
  btnPrimary: "btn-primary",
  btnGhost: "btn-ghost",
  btnChip: "btn-chip",
  btnToggle: "btn-toggle",
  btnSm: "btn-sm",
  field: "field-atelier",
  label: "label-atelier",
  divider: "divider-atelier",
} as const;

export type MiraiClass = (typeof MIRAI)[keyof typeof MIRAI];
