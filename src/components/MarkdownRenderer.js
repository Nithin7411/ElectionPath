import React from "react";

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  const renderLine = (line, index) => {
    // Process bold (**text**)
    let html = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Process italic (*text*)
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Check for lists
    if (html.trim().startsWith('- ') || html.trim().startsWith('* ')) {
      return (
        <li key={index} className="mb-1" style={{ marginLeft: '1.5rem' }} dangerouslySetInnerHTML={{ __html: html.substring(2) }} />
      );
    }
    
    // Check for headers
    if (html.trim().startsWith('### ')) {
      return <h4 key={index} className="mt-4 mb-2" dangerouslySetInnerHTML={{ __html: html.substring(4) }} />;
    }
    
    if (html.trim().startsWith('## ')) {
      return <h3 key={index} className="mt-4 mb-2" dangerouslySetInnerHTML={{ __html: html.substring(3) }} />;
    }

    if (html.trim() === "") {
      return <br key={index} />;
    }

    return <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div style={{ lineHeight: '1.6' }}>
      {content.split('\n').map((line, i) => renderLine(line, i))}
    </div>
  );
}
