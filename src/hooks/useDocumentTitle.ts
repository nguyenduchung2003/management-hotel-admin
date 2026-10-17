import { useEffect } from 'react'

const SUFFIX = 'Quản trị · Tên Homestay'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SUFFIX}` : SUFFIX
  }, [title])
}
