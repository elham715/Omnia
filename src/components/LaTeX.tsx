import React from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface LaTeXProps {
  children: string;
  block?: boolean;
}

export function LaTeX({ children, block = false }: LaTeXProps) {
  try {
    return block ? (
      <BlockMath math={children} />
    ) : (
      <InlineMath math={children} />
    );
  } catch (error) {
    console.error('LaTeX rendering error:', error);
    return <span className="text-red-500 text-sm">LaTeX Error: {children}</span>;
  }
}