import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Your money. A clearer picture.' })).toBeVisible()
})

test('renders the reference panels without page overflow or runtime errors', async ({
  page,
}, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Savings goals' })).toBeVisible()
  await expect(page.getByText('R$ 24,680.00', { exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: testInfo.outputPath('dashboard.png'), fullPage: true })
  expect(errors).toEqual([])
})

test('searches by transaction name and presents an empty state', async ({ page }) => {
  const search = page.getByRole('searchbox', { name: 'Search transactions' })
  await search.fill('Netflix')
  await expect(page.locator('tbody tr')).toHaveCount(1)
  await expect(page.locator('tbody')).toContainText('Netflix')
  await search.fill('not-a-transaction')
  await expect(page.getByText('No transactions found.')).toBeVisible()
  await search.clear()
  await expect(page.locator('tbody tr')).toHaveCount(4)
})

test('adds an expense, reconciles balances and resets on reload', async ({ page }) => {
  await page.getByRole('button', { name: 'Add transaction', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Description').fill('Coffee with friends')
  await dialog.getByLabel('Amount (BRL)').fill('25.50')
  await dialog.getByRole('button', { name: 'Add transaction', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await expect(page.locator('tbody')).toContainText('Coffee with friends')
  await expect(page.locator('.summary-grid')).toContainText('R$ 24,654.50')
  await expect(page.locator('.summary-grid')).toContainText('R$ 5,325.50')
  await expect(page.locator('.summary-grid')).toContainText('R$ 1,174.50 left in your budget')
  await page.reload()
  await expect(page.locator('.summary-grid')).toContainText('R$ 24,680.00')
  await expect(page.locator('tbody')).not.toContainText('Coffee with friends')
})

test('creates a goal and updates the budget limit', async ({ page }) => {
  await page.getByRole('button', { name: '+ New goal' }).click()
  let dialog = page.getByRole('dialog')
  await dialog.getByLabel('Goal name').fill('New laptop')
  await dialog.getByLabel('Target (BRL)', { exact: true }).fill('10000')
  await dialog.getByLabel('Already saved (BRL)').fill('2500')
  await dialog.getByRole('button', { name: 'Create goal' }).click()
  await expect(page.getByRole('heading', { name: 'New laptop' })).toBeVisible()
  await expect(page.getByRole('progressbar', { name: 'New laptop' })).toHaveAttribute(
    'aria-valuenow',
    '25',
  )
  await page.getByRole('button', { name: 'Manage', exact: true }).click()
  dialog = page.getByRole('dialog')
  await dialog.getByLabel('Housing', { exact: true }).fill('3500')
  await dialog.getByRole('button', { name: 'Save budget' }).click()
  await expect(page.locator('.summary-grid')).toContainText('R$ 1,700.00 left in your budget')
})

test('changes chart period, expands transactions and closes dialogs with Escape', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Week', exact: true }).click()
  await expect(page.getByRole('group', { name: 'Week cash flow', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Week', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.getByRole('button', { name: 'View all', exact: true }).click()
  await expect(page.locator('tbody tr')).toHaveCount(6)
  const addButton = page.getByRole('button', { name: 'Add transaction', exact: true })
  await addButton.click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(addButton).toBeFocused()
})

test('keeps navigation usable on mobile', async ({ page, isMobile }) => {
  if (isMobile) await page.getByRole('button', { name: 'Toggle navigation' }).click()
  await page.getByRole('button', { name: 'Accounts', exact: true }).click()
  await expect(page.getByRole('dialog')).toContainText('Everyday account')
  await page.getByRole('button', { name: 'Close dialog' }).click()
  await page.setViewportSize({ width: 320, height: 740 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})
