import { expect, test } from "@playwright/test";

declare global {
  interface Window {
    __clipboardCalls?: string[];
  }
}

const MAIN_NAV = "header nav[aria-label='Primary']";
const NAV_LABELS = ["Articles", "Categories", "Archive", "Search", "About", "RSS"];

test.describe("publication", () => {
  test("home page renders the hero and the primary masthead", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1.display-title")).toHaveText(
      "Systems, examined carefully.",
    );

    const width = (await page.viewportSize())?.width ?? 1024;
    if (width < 768) {
      await expect(page.locator('button[aria-controls="mobile-navigation"]')).toBeVisible();
      return;
    }
    for (const label of NAV_LABELS) {
      await expect(page.locator(MAIN_NAV).getByRole("link", { name: label })).toBeVisible();
    }
  });

  test("hero CTAs navigate into the site", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Browse writing" }).click();
    await expect(page).toHaveURL(/\/articles$/);
    await page.goto("/");
    await page.getByRole("link", { name: "Search notes" }).click();
    await expect(page).toHaveURL(/\/search$/);
  });

  test("articles page lists every published article", async ({ page }) => {
    await page.goto("/articles");
    await expect(page.locator("h1")).toHaveText("Articles");
    await expect(page.locator(".index-row")).toHaveCount(8);
  });

  test("article detail renders the paper, TOC, and a live Mermaid diagram", async ({ page }) => {
    await page.goto("/articles/designing-a-rate-limiter");
    await expect(page.locator("h1")).toHaveText("Designing a Rate Limiter");
    await expect(page.locator("main .paper .article-prose")).toBeVisible();

    const width = (await page.viewportSize())?.width ?? 1024;
    if (width >= 768) {
      await expect(page.locator("aside nav[aria-label='Table of contents']")).toBeVisible();
    } else {
      await expect(page.locator("main details.lg\\:hidden")).toBeVisible();
    }

    await page.locator(".diagram").scrollIntoViewIfNeeded();
    const diagram = page.locator(".diagram-svg svg");
    await diagram.waitFor({ state: "attached", timeout: 15000 });
    await expect(diagram).toBeVisible();
  });

  test("reading progress bar is present on the article page", async ({ page }) => {
    await page.goto("/articles/designing-a-rate-limiter");
    const bar = page.locator("div[aria-hidden='true']").first();
    await expect(bar).toBeAttached();
  });

  test("categories page lists the eight topics", async ({ page }) => {
    await page.goto("/categories");
    await expect(page.locator("h1")).toHaveText("Categories");
    await expect(page.locator("main ul li a")).toHaveCount(8);
  });

  test("category detail lists that category's articles", async ({ page }) => {
    await page.goto("/categories/backend-engineering");
    await expect(page.locator("h1")).toHaveText("Backend Engineering");
    await expect(page.locator(".index-row")).toHaveCount(1);
  });

  test("tags page lists the normalized tag topics", async ({ page }) => {
    await page.goto("/tags");
    await expect(page.locator("h1")).toHaveText("Tags");
    await expect(page.locator("main ul li a").first()).toContainText(/^#/);
  });

  test("tag detail lists articles carrying that tag", async ({ page }) => {
    await page.goto("/tags/redis");
    await expect(page.locator("h1")).toHaveText("#redis");
    await expect(page.locator(".index-row")).toHaveCount(1);
  });

  test("archive groups by year", async ({ page }) => {
    await page.goto("/archive");
    await expect(page.locator("h1")).toHaveText("Archive");
    await expect(page.locator("main section[aria-label*='Articles from 2026']").first()).toBeVisible();
  });

  test("about page renders principles and publication context", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("h1")).toHaveText(
      "A publication about how systems actually behave.",
    );
    await expect(page.locator("ol li h3").first()).toBeVisible();
  });
});

test.describe("feeds and discovery", () => {
  test("search filters by query and shows no-results state", async ({ page }) => {
    await page.goto("/search");
    await expect(page.locator('input[type="search"]')).toBeVisible();

    await page.locator('input[type="search"]').fill("redis");
    await expect(page.locator("main a[href='/articles/designing-a-rate-limiter']").first()).toBeVisible();
    await expect(page.locator("[aria-live='polite']").first()).toContainText(/1 article/i);
    await expect(page).toHaveURL(/q=redis/);

    await page.locator('input[type="search"]').fill("xyz-nonexistent");
    await expect(page.locator("text=No articles match that search.")).toBeVisible();
  });

  test("RSS feed is served", async ({ page }) => {
    const response = await page.goto("/rss.xml");
    expect(response?.ok()).toBe(true);
  });

  test("sitemap and robots are served", async ({ page }) => {
    const sitemap = await page.goto("/sitemap.xml");
    expect(sitemap?.ok()).toBe(true);
    await expect(page.locator("body").first().evaluate((el) => el.textContent)).resolves.toContain(
      "/articles/designing-a-rate-limiter",
    );

    const robots = await page.goto("/robots.txt");
    expect(robots?.ok()).toBe(true);
    await expect(page.locator("body").first().evaluate((el) => el.textContent)).resolves.toContain("User-Agent: *");
  });

  test("drafts are not served", async ({ page }) => {
    const response = await page.goto("/articles/draft-notes-on-raft");
    expect(response?.status()).toBe(404);
  });

  test("missing routes render the not-found page with status 404", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toContainText("outside the published set");
    await page.getByRole("link", { name: "Browse articles" }).click();
    await expect(page).toHaveURL(/\/articles$/);
  });
});

test.describe("interactions", () => {
  test("mobile nav opens and closes", async ({ page }) => {
    test.skip(
      (page.viewportSize()?.width ?? 1024) >= 768,
      "skips on desktop viewports",
    );
    await page.goto("/");
    const menuButton = page.locator('button[aria-controls="mobile-navigation"]');
    await expect(menuButton).toBeVisible();

    await menuButton.click();
    const mobileNav = page.locator("#mobile-navigation");
    await expect(mobileNav).toBeVisible();

    await menuButton.click();
    await expect(mobileNav).toBeHidden();
  });

  test("copy link button copies the current URL", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        value: {
          writeText: async (text: string) => {
            window.__clipboardCalls ??= [];
            window.__clipboardCalls?.push(text);
          },
        },
      });
    });

    await page.goto("/articles/designing-a-rate-limiter");
    await page.getByRole("button", { name: "Copy link" }).click();
    await expect(page.getByRole("button", { name: "Link copied" })).toBeVisible();
    const calls = await page.evaluate(() => window.__clipboardCalls ?? []);
    expect(calls.length).toBe(1);
    expect(calls[0]).toContain("/articles/designing-a-rate-limiter");
  });
});
