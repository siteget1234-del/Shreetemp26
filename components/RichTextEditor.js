'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill with no SSR
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

/**
 * RichTextEditor Component
 * A simple rich text editor with formatting options and character limit
 * 
 * @param {string} value - Current text value
 * @param {function} onChange - Callback when text changes
 * @param {number} maxLength - Maximum character limit (default: 1500)
 * @param {string} placeholder - Placeholder text
 */
export default function RichTextEditor({ value, onChange, maxLength = 1500, placeholder = 'Write your blog content...' }) {
  const quillRef = useRef(null);

  // Toolbar configuration - minimal and essential
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link'
  ];

  // Handle text change with character limit
  const handleChange = (content, delta, source, editor) => {
    const text = editor.getText();
    const length = text.trim().length;
    
    // Enforce character limit
    if (length <= maxLength) {
      onChange(content);
    } else {
      // Truncate if exceeds limit
      const truncated = text.substring(0, maxLength);
      const quill = quillRef.current?.getEditor();
      if (quill) {
        quill.setText(truncated);
      }
    }
  };

  // Calculate character count
  const getCharCount = () => {
    if (typeof window === 'undefined') return 0;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = value;
    return tempDiv.textContent?.trim().length || 0;
  };

  const charCount = getCharCount();
  const isNearLimit = charCount > maxLength * 0.9;
  const isOverLimit = charCount > maxLength;

  return (
    <div className="space-y-2">
      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="blog-editor"
        />
      </div>
      
      {/* Character Counter */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-gray-600">
          Use formatting tools to create rich content
        </p>
        <p className={`font-semibold ${
          isOverLimit ? 'text-red-600' : 
          isNearLimit ? 'text-orange-600' : 
          'text-gray-600'
        }`}>
          {charCount} / {maxLength} characters
        </p>
      </div>
      
      {isOverLimit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700 font-semibold">
            ⚠️ Character limit exceeded! Please reduce content.
          </p>
        </div>
      )}

      {/* Custom Styles for Editor */}
      <style jsx global>{`
        .blog-editor .ql-container {
          min-height: 200px;
          font-size: 15px;
          font-family: inherit;
        }
        
        .blog-editor .ql-editor {
          min-height: 200px;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .blog-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        
        .blog-editor .ql-toolbar {
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }
        
        .blog-editor .ql-stroke {
          stroke: #4b5563;
        }
        
        .blog-editor .ql-fill {
          fill: #4b5563;
        }
        
        .blog-editor .ql-picker-label {
          color: #4b5563;
        }
      `}</style>
    </div>
  );
}
