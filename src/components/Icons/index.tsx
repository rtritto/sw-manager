import type { Component } from 'solid-js'

import IconTemplate, { type IconProps } from './IconTemplate'
import { FolderOpen } from './SvgBase64'

const a = { viewBox: '0 0 24 24' }

export const FolderOpenIcon: Component<IconProps> = (props) => IconTemplate({ a, c: `<path d="${FolderOpen}"/>` }, props)