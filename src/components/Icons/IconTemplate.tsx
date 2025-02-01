// https://github.com/x64Bits/solid-icons/blob/main/src/lib/index.tsx
import { type JSX, createEffect, createMemo, createSignal, onCleanup, splitProps } from 'solid-js'
import { mergeProps } from 'solid-js'
import { isServer, ssr } from 'solid-js/web'

type SVGSVGElementTags = JSX.SVGElementTags['svg']

interface IconTree {
  a: SVGSVGElementTags
  c: string
}

export interface IconProps extends SVGSVGElementTags {
  size?: string | number
  color?: string
  title?: string
  style?: JSX.CSSProperties
}

interface IconBaseProps extends IconProps {
  src: IconTree
}

export default function IconTemplate(iconSrc: IconTree, props: IconProps): JSX.Element {
  const mergedProps = mergeProps(iconSrc.a, props) as IconBaseProps
  const svgProps = splitProps(mergedProps, ['src']).at(1)
  const [content, setContent] = createSignal<string>('')
  const rawContent = createMemo(() =>
    props.title ? `${iconSrc.c}<title>${props.title}</title>` : iconSrc.c
  )

  createEffect(() => setContent(rawContent()))

  onCleanup(() => {
    setContent('')
  })

  return (
    <svg
      stroke={iconSrc.a?.stroke}
      color={props.color || 'currentColor'}
      fill={props.color || 'currentColor'}
      stroke-width='0'
      style={{
        ...props.style,
        overflow: 'visible'
      }}
      {...svgProps}
      /* eslint-disable-next-line unicorn/explicit-length-check */
      height={props.size || '1em'}
      /* eslint-disable-next-line unicorn/explicit-length-check */
      width={props.size || '1em'}
      xmlns='http://www.w3.org/2000/svg'
      innerHTML={content()}
    >
      {isServer && ssr(rawContent())}
    </svg>
  )
}