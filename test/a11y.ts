import axe, { type ContextObject, type Result, type RunOptions } from "axe-core";

/**
 * Accessibility assertions for rendered screens — runs the real axe engine
 * over a rendered tree so a WCAG regression fails a test.
 *
 * **What this cannot see.** jsdom has no layout and paints nothing, so rules
 * that need them — colour contrast above all — are disabled explicitly rather
 * than reported as passing. Check contrast in a real browser (Lighthouse).
 */
const rulesNeedingLayout = ["color-contrast", "scrollable-region-focusable"];

/** WCAG 2.1 A and AA. */
const defaultOptions: RunOptions = {
  runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
  rules: Object.fromEntries(rulesNeedingLayout.map((rule) => [rule, { enabled: false }])),
};

/**
 * Third-party markup we cannot fix from this codebase, excluded by selector
 * (not by disabling the rule) so our own markup is still checked. Add an entry
 * only with a comment saying why the library's output is still accessible.
 */
const thirdPartyExclusions: string[] = [];

/** Every violation axe found, most severe first. */
export const findA11yViolations = async (
  container: Element,
  options: RunOptions = defaultOptions,
): Promise<Result[]> => {
  const context: ContextObject = {
    include: [container],
    exclude: thirdPartyExclusions,
  };
  const result = await axe.run(context, options);
  const order = { critical: 0, serious: 1, moderate: 2, minor: 3 } as const;

  return [...result.violations].sort(
    (left, right) =>
      (order[left.impact as keyof typeof order] ?? 4) -
      (order[right.impact as keyof typeof order] ?? 4),
  );
};

/** A violation rendered as something a failing test can be read from. */
export const describeViolations = (violations: Result[]) =>
  violations
    .map(
      (violation) =>
        `[${violation.impact}] ${violation.id}: ${violation.help}\n` +
        violation.nodes.map((node) => `    ${node.html.slice(0, 160)}`).join("\n"),
    )
    .join("\n\n");

/** Asserts a rendered container has no WCAG A/AA violation axe can see here. */
export const expectNoA11yViolations = async (container: Element) => {
  const violations = await findA11yViolations(container);

  if (violations.length)
    throw new Error(
      `${violations.length} accessibility violation(s):\n\n${describeViolations(violations)}`,
    );
};
