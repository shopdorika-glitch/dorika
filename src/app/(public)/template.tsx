/**
 * Re-mounts on every route change inside the public group, which gives each
 * page a short, consistent entrance instead of an abrupt swap. Kept to 8px of
 * travel so it reads as a settle, not an animation.
 */
export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  return <div className="route-enter">{children}</div>;
}
