import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { Dialog as SitoDialog } from '@sito/ui'
import { Icon } from '../../elements'
import type { DialogProps } from './types'

export function Dialog({
  closeIcon = <Icon icon={faXmark} fixedWidth />,
  ...props
}: DialogProps) {
  return <SitoDialog {...props} closeIcon={closeIcon} />
}
