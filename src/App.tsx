import { useEffect } from 'react'
import { HashRouter, Route, Routes, useParams } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { setSoundEnabled } from '@/lib/audio'
import { useAppStore } from '@/stores/useAppStore'
import Home from '@/pages/Home'
import SceneFlow from '@/pages/SceneFlow'
import History from '@/pages/History'
import Pool from '@/pages/Pool'
import Settings from '@/pages/Settings'

/** sceneId 变化时强制重挂载场景流程，避免跨场景状态残留 */
function SceneFlowRoute() {
  const { sceneId } = useParams()
  return <SceneFlow key={sceneId} />
}

export default function App() {
  const soundOn = useAppStore((s) => s.soundOn)

  useEffect(() => {
    setSoundEnabled(soundOn)
  }, [soundOn])

  return (
    <HashRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scene/:sceneId" element={<SceneFlowRoute />} />
          <Route path="/history" element={<History />} />
          <Route path="/pool" element={<Pool />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppShell>
    </HashRouter>
  )
}
