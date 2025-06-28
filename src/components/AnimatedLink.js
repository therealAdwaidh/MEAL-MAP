// components/AnimatedLink.js
import Link from "next/link";


export default function AnimatedLink({ href, children }) {
  return (
    <Link href={href} className="animated-link">
      {children}
      <div className="link-block-underline" />
    </Link>
  );
}
