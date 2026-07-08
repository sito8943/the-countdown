import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconProps } from './types'

// We import the FA core CSS ourselves above, so disable the runtime injection
// that would otherwise cause an icon size flash before styles load.
config.autoAddCss = false

/**
 * Thin wrapper around FontAwesomeIcon. Import it once instead of pulling
 * FontAwesomeIcon into every component: `<Icon icon={faPen} />`.
 */
export function Icon(props: IconProps) {
  return <FontAwesomeIcon {...props} />
}
