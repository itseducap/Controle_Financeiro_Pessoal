import { onMounted, onUnmounted, ref, shallowRef, useId } from 'vue'

/** Compartilha mouse, foco e toque; o gráfico continua responsável pelos dados exibidos. */
export function useChartTooltip() {
  const tooltipId = useId()
  const activeKey = ref<string | null>(null)
  const anchor = shallowRef<Element | null>(null)
  let closeTimeout: ReturnType<typeof setTimeout> | undefined
  let openedAtScroll = { x: 0, y: 0 }

  function keepOpen() {
    clearTimeout(closeTimeout)
  }

  function close() {
    keepOpen()
    activeKey.value = null
    anchor.value = null
  }

  function scheduleClose() {
    keepOpen()
    // Permite atravessar o pequeno espaço entre a barra e o tooltip sem fazê-lo desaparecer.
    closeTimeout = setTimeout(close, 160)
  }

  function open(key: string, event: Event) {
    if (!(event.currentTarget instanceof Element)) return
    keepOpen()
    activeKey.value = key
    anchor.value = event.currentTarget
    openedAtScroll = { x: window.scrollX, y: window.scrollY }
  }

  function triggerBindings(key: string) {
    return {
      'aria-describedby': activeKey.value === key ? tooltipId : undefined,
      onPointerenter: (event: PointerEvent) => {
        if (event.pointerType !== 'touch') open(key, event)
      },
      onPointerleave: (event: PointerEvent) => {
        if (event.pointerType !== 'touch') scheduleClose()
      },
      onFocus: (event: FocusEvent) => open(key, event),
      onBlur: scheduleClose,
      onClick: (event: MouseEvent) => open(key, event),
      onKeydown: (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          open(key, event)
        }
      },
    }
  }

  function dismissOutside(event: PointerEvent) {
    if (!(event.target instanceof Node)) return
    const tooltip = document.getElementById(tooltipId)
    if (!anchor.value?.contains(event.target) && !tooltip?.contains(event.target)) close()
  }

  function dismissWithEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') close()
  }

  function dismissOnScroll(event: Event) {
    // O navegador pode entregar um scroll anterior depois do pointerenter/focus.
    // Só fecha se a posição realmente mudou desde a abertura da dica.
    if (
      event.target !== document ||
      window.scrollX !== openedAtScroll.x ||
      window.scrollY !== openedAtScroll.y
    )
      close()
  }

  onMounted(() => {
    document.addEventListener('pointerdown', dismissOutside)
    document.addEventListener('keydown', dismissWithEscape)
    // Fecha ao mover a página: nunca deixa uma dica flutuando longe da barra de origem.
    window.addEventListener('scroll', dismissOnScroll, true)
    window.addEventListener('resize', close)
  })

  onUnmounted(() => {
    keepOpen()
    document.removeEventListener('pointerdown', dismissOutside)
    document.removeEventListener('keydown', dismissWithEscape)
    window.removeEventListener('scroll', dismissOnScroll, true)
    window.removeEventListener('resize', close)
  })

  return { tooltipId, activeKey, anchor, triggerBindings, keepOpen, scheduleClose, close }
}
