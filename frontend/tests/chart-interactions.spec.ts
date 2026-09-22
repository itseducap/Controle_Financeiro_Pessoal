import { expect, test, type Locator, type Page } from '@playwright/test'

async function activate(target: Locator, touch: boolean) {
  await target.scrollIntoViewIfNeeded()
  if (touch) await target.tap()
  else await target.hover()
}

async function expectTooltipInsideViewport(page: Page) {
  const bounds = await page.getByRole('tooltip').boundingBox()
  const viewport = page.viewportSize()!
  expect(bounds).not.toBeNull()
  expect(bounds!.x).toBeGreaterThanOrEqual(0)
  expect(bounds!.y).toBeGreaterThanOrEqual(0)
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width)
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Cash flow', exact: true })).toBeVisible()
})

test('expands the selected bar from its base and shows its own data', async ({
  page,
  isMobile,
}, testInfo) => {
  const bar = page.getByRole('button', { name: 'Sep Income: R$ 8,500.00', exact: true })
  await bar.scrollIntoViewIfNeeded()
  const shape = bar.locator('.cash-flow-bar')
  const before = (await shape.boundingBox())!
  await activate(bar, isMobile)
  const tooltip = page.getByRole('tooltip')
  await expect(tooltip).toContainText('Sep')
  await expect(tooltip).toContainText('IncomeR$ 8,500.00')
  await expect(tooltip).not.toContainText('Expenses')
  await expect
    .poll(async () => (await shape.boundingBox())!.height)
    .toBeGreaterThan(before.height * 1.035)
  const after = (await shape.boundingBox())!
  expect(after.width).toBeGreaterThan(before.width)
  expect(after.width).toBeLessThanOrEqual(before.width * 1.045)
  expect(after.height).toBeLessThanOrEqual(before.height * 1.045)
  expect(Math.abs(after.y + after.height - (before.y + before.height))).toBeLessThan(1)
  await expectTooltipInsideViewport(page)
  await page.screenshot({ path: testInfo.outputPath('cash-flow-tooltip.png') })
  if (!isMobile) {
    // A dica deve continuar visível enquanto o usuário lê seu conteúdo com o mouse sobre ela.
    await tooltip.hover()
    await expect(tooltip).toBeVisible()
  }
  await page.keyboard.press('Escape')
  await expect(tooltip).toHaveCount(0)
  await expect(bar).not.toHaveClass(/is-active/)
})

test('supports keyboard navigation, zero values and switching periods', async ({ page }) => {
  const firstBar = page.getByRole('button', { name: 'Apr Income: R$ 6,200.00', exact: true })
  await firstBar.scrollIntoViewIfNeeded()
  await firstBar.focus()
  await expect(page.getByRole('tooltip')).toContainText('R$ 6,200.00')
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('button', { name: 'Apr Expenses: R$ 4,200.00', exact: true }),
  ).toBeFocused()
  await expect(page.getByRole('tooltip')).toContainText('R$ 4,200.00')
  await page.getByRole('button', { name: 'Week', exact: true }).click()
  await expect(page.getByRole('tooltip')).toHaveCount(0)
  const zeroBar = page.getByRole('button', { name: 'Mon Income: R$ 0.00', exact: true })
  await zeroBar.focus()
  await zeroBar.press('Enter')
  await expect(page.getByRole('tooltip')).toContainText('R$ 0.00')
  await page.getByRole('button', { name: 'Year', exact: true }).click()
  await expect(page.getByRole('tooltip')).toHaveCount(0)
})

test('ignores the space around bars and the unfilled budget track', async ({ page }) => {
  const bar = page.getByRole('button', { name: 'Sep Income: R$ 8,500.00', exact: true })
  await bar.scrollIntoViewIfNeeded()
  const shape = bar.locator('.cash-flow-bar')
  const bounds = (await shape.boundingBox())!
  await page.mouse.move(bounds.x - 2, bounds.y + bounds.height / 2)
  await expect(page.getByRole('tooltip')).toHaveCount(0)
  await expect(bar).not.toHaveClass(/is-active/)
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height + 2)
  await expect(page.getByRole('tooltip')).toHaveCount(0)
  await shape.hover()
  await expect(page.getByRole('tooltip')).toBeVisible()
  await page.mouse.move(bounds.x - 2, bounds.y + bounds.height / 2)
  await expect
    .poll(async () => (await shape.boundingBox())!.width)
    .toBeLessThanOrEqual(bounds.width * 1.005)
  await expect(page.getByRole('tooltip')).toHaveCount(0)

  const segment = page.getByRole('button', { name: 'Housing: R$ 2,900.00 spent', exact: true })
  await segment.scrollIntoViewIfNeeded()
  const segmentBounds = (await segment.locator('.budget-segment').boundingBox())!
  await page.mouse.move(segmentBounds.x + segmentBounds.width / 2, segmentBounds.y - 4)
  await expect(page.getByRole('tooltip')).toHaveCount(0)
  await expect(segment).not.toHaveClass(/is-active/)

  const line = page.getByRole('progressbar', { name: 'Lifestyle', exact: true })
  await line.scrollIntoViewIfNeeded()
  const track = (await line.locator('.progress-track').boundingBox())!
  await page.mouse.move(track.x + track.width / 2, track.y - 4)
  await expect(page.getByRole('tooltip')).toHaveCount(0)
  await page.mouse.move(track.x + track.width * 0.9, track.y + track.height / 2)
  await expect(line).not.toHaveClass(/is-active/)
  await expect(page.getByRole('tooltip')).toHaveCount(0)
  await line.locator('.progress-track > span').hover()
  await expect(page.getByRole('tooltip')).toContainText('Lifestyle')
})

test('expands budget segments and category lines and uses updated limits', async ({
  page,
  isMobile,
}, testInfo) => {
  const segment = page.getByRole('button', { name: 'Housing: R$ 2,900.00 spent', exact: true })
  await segment.scrollIntoViewIfNeeded()
  const beforeSegment = (await segment.locator('.budget-segment').boundingBox())!
  await activate(segment, isMobile)
  await expect(page.getByRole('tooltip')).toContainText('Housing')
  await expect(page.getByRole('tooltip')).toContainText('R$ 2,900.00')
  await expect(page.getByRole('tooltip')).toContainText('R$ 3,000.00')
  await expect(page.getByRole('tooltip')).toContainText('97%')
  await expect
    .poll(async () => (await segment.locator('.budget-segment').boundingBox())!.height)
    .toBeGreaterThan(beforeSegment.height * 1.1)
  expect((await segment.locator('.budget-segment').boundingBox())!.height).toBeLessThanOrEqual(
    beforeSegment.height * 1.16,
  )

  await page.keyboard.press('Escape')
  const line = page.getByRole('progressbar', { name: 'Housing', exact: true })
  const beforeLine = (await line.locator('.progress-track').boundingBox())!
  await activate(line, isMobile)
  await expect(page.getByRole('tooltip')).toContainText('97%')
  await expect
    .poll(async () => (await line.locator('.progress-track').boundingBox())!.height)
    .toBeGreaterThan(beforeLine.height * 1.1)
  expect((await line.locator('.progress-track').boundingBox())!.height).toBeLessThanOrEqual(
    beforeLine.height * 1.16,
  )
  await expectTooltipInsideViewport(page)
  await page.screenshot({ path: testInfo.outputPath('budget-tooltip.png') })

  await page.getByRole('button', { name: 'Manage', exact: true }).click()
  await page.getByRole('dialog').getByLabel('Housing', { exact: true }).fill('3500')
  await page.getByRole('button', { name: 'Save budget', exact: true }).click()
  await activate(line, isMobile)
  await expect(page.getByRole('tooltip')).toContainText('R$ 3,500.00')
  await expect(page.getByRole('tooltip')).toContainText('83%')
})

test('keeps tooltips inside a narrow screen and respects reduced motion', async ({
  page,
  isMobile,
}) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const bar = page.getByRole('button', { name: 'Sep Expenses: R$ 5,300.00', exact: true })
  await activate(bar, isMobile)
  await expect(page.getByRole('tooltip')).toBeVisible()
  await expectTooltipInsideViewport(page)
  expect(
    await bar
      .locator('.cash-flow-bar')
      .evaluate((element) => getComputedStyle(element).transitionDuration),
  ).toBe('0s')
  expect(
    await page.getByRole('tooltip').evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none')
  await page.keyboard.press('Escape')
  const line = page.getByRole('progressbar', { name: 'Lifestyle', exact: true })
  await activate(line, isMobile)
  await expect(page.getByRole('tooltip')).toContainText('60%')
  await expectTooltipInsideViewport(page)
  await page.getByRole('heading', { name: 'Monthly budget', exact: true }).click()
  await expect(page.getByRole('tooltip')).toHaveCount(0)
})

test('shows new transaction totals in the chart and budget tooltips', async ({
  page,
  isMobile,
}) => {
  await page.getByRole('button', { name: 'Add transaction', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Description').fill('Dinner')
  await dialog.getByLabel('Amount (BRL)').fill('50')
  await dialog.getByRole('button', { name: 'Add transaction', exact: true }).click()
  await activate(
    page.getByRole('button', { name: 'Sep Expenses: R$ 5,350.00', exact: true }),
    isMobile,
  )
  await expect(page.getByRole('tooltip')).toContainText('R$ 5,350.00')
  await page.keyboard.press('Escape')
  await activate(page.getByRole('progressbar', { name: 'Food & groceries', exact: true }), isMobile)
  await expect(page.getByRole('tooltip')).toContainText('R$ 1,550.00')
  await expect(page.getByRole('tooltip')).toContainText('78%')
})
