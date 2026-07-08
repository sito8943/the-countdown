import type { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'

/**
 * Props for the Icon element. Mirrors FontAwesomeIcon so every FA prop
 * (icon, size, spin, fixedWidth, color, className, ...) is available.
 * Consumers only import the `fa*` icon definition and pass it as `icon`.
 */
export type IconProps = FontAwesomeIconProps
