import React from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface LaTeXProps {
  children: string;
  block?: boolean;
}

export function LaTeX({ children, block = false }: LaTeXProps) {
  const parts: React.ReactNode[] = [];
  const regex = /\$\$(.*?)\$\$/g;
  let lastIndex = 0;
  let match;

  // Check if the entire string is a single block math
  const fullBlockMatch = children.match(/^\$\$(.*?)\$\$$/);
  if (block && fullBlockMatch) {
    try {
      return <BlockMath math={fullBlockMatch[1]} />;
    } catch (error) {
      console.error('LaTeX rendering error:', error);
      return <span className="text-red-500 text-sm">LaTeX Error: {fullBlockMatch[1]}</span>;
    }
  }

  while ((match = regex.exec(children)) !== null) {
    // Add preceding plain text
    if (match.index > lastIndex) {
      parts.push(<span key={`text-${lastIndex}`}>{children.substring(lastIndex, match.index)}</span>);
    }

    // Add LaTeX part
    const latexContent = match[1];
    try {
      parts.push(<InlineMath key={`latex-${match.index}`} math={latexContent} />);
    } catch (error) {
      console.error('LaTeX rendering error:', error);
      parts.push(<span key={`latex-error-${match.index}`} className="text-red-500 text-sm">LaTeX Error: {latexContent}</span>);
    }

    lastIndex = regex.lastIndex;
  }

  // Add any remaining plain text
  if (lastIndex < children.length) {
    parts.push(<span key={`text-${lastIndex}`}>{children.substring(lastIndex)}</span>);
  }

  // If no LaTeX delimiters were found, render as plain text
  if (parts.length === 0 && children.length > 0) {
    return <span>{children}</span>;
  }

  return <>{parts}</>;
}
