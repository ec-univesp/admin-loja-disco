export function runSequentialTests(suite: () => Promise<void>): void {
  suite().catch((error) => {
    process.exitCode = 1;
    console.error(error);
  });
}
