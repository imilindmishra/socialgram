import { useEffect } from 'react';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);
}

