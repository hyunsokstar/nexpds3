// src/app/page.tsx
import { MainLayout } from '@/widgets/main-layout'

export default function Home() {
  return (
    <MainLayout>
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        {/* <h1 className="text-2xl font-bold">Welcome to NEXDPS</h1> */}
        <p className="text-lg mt-4">내용 출력</p>
      </div>
    </MainLayout>
  )
}