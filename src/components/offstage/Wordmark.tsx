export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-wide uppercase ${className}`}>
      Vara <span className="text-primary">[Offstage]</span>
    </span>
  );
}
