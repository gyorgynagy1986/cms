"use client"

import { useState, useEffect } from 'react'

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(null)
  const [results, setResults] = useState(null)
  const [dataInfo, setDataInfo] = useState({ count: 0, totalImages: 0 })
  
  // 🔥 JAVÍTOTT: Nincs propertiesData hivatkozás!
  const [config, setConfig] = useState({
    batchSize: 5,
    startIndex: 0,
    endIndex: 100 // Alapértelmezett érték, később frissül
  })

  // Adat információk lekérése
  useEffect(() => {
    const fetchDataInfo = async () => {
      try {
        console.log('📊 Adatinfo lekérése...')
        const response = await fetch('/api/data-info')
        if (response.ok) {
          const info = await response.json()
          console.log('✅ Adatinfo megérkezett:', info)
          setDataInfo(info)
          // Config frissítése az igazi adatmennyiséggel
          setConfig(prev => ({
            ...prev,
            endIndex: info.count
          }))
        } else {
          console.error('❌ Adatinfo API hiba:', response.status)
        }
      } catch (error) {
        console.error('❌ Adatinfo lekérési hiba:', error)
      }
    }
    
    fetchDataInfo()
  }, [])

  const startUpload = async () => {
    setIsUploading(true)
    setProgress(null)
    setResults(null)

    try {
      console.log('🚀 Upload indítása...')
      
      const response = await fetch('/api/upload-properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batch: config.batchSize,
          start: config.startIndex,
          end: config.endIndex
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setResults(data.results)
        console.log('✅ Upload befejezve:', data)
      } else {
        console.error('❌ Upload hiba:', data.error)
        alert('Hiba történt: ' + data.message)
      }
    } catch (error) {
      console.error('❌ Hálózati hiba:', error)
      alert('Hálózati hiba: ' + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const resetUpload = () => {
    setResults(null)
    setProgress(null)
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🏠 Ingatlan Feltöltő - Supabase
      </h1>
      
      {/* Adat információk */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center space-x-8 text-sm">
          <div className="text-center">
            <div className="font-bold text-lg text-blue-600">{dataInfo.count || 'Betöltés...'}</div>
            <div className="text-blue-800">Összesen ingatlan</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-green-600">{dataInfo.totalImages || 'Betöltés...'}</div>
            <div className="text-green-800">Összesen kép</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-purple-600">
              ~{Math.ceil((dataInfo.count || 0) * 2 / 60)} perc
            </div>
            <div className="text-purple-800">Becsült teljes idő</div>
          </div>
        </div>
      </div>

      {/* Konfiguráció */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">⚙️ Beállítások</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Batch méret (egyszerre)
            </label>
            <input
              type="number"
              value={config.batchSize}
              onChange={(e) => setConfig({...config, batchSize: parseInt(e.target.value)})}
              className="w-full border rounded px-3 py-2"
              min="1"
              max="20"
              disabled={isUploading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Start index
            </label>
            <input
              type="number"
              value={config.startIndex}
              onChange={(e) => setConfig({...config, startIndex: parseInt(e.target.value)})}
              className="w-full border rounded px-3 py-2"
              min="0"
              disabled={isUploading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Vég index
            </label>
            <input
              type="number"
              value={config.endIndex}
              onChange={(e) => setConfig({...config, endIndex: parseInt(e.target.value)})}
              className="w-full border rounded px-3 py-2"
              min="1"
              max={dataInfo.count || 1000}
              disabled={isUploading}
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm text-blue-800">
            📊 Feldolgozandó ingatlanok: <strong>{config.endIndex - config.startIndex}</strong>
            <br />
            ⚡ Batch-ek száma: <strong>{Math.ceil((config.endIndex - config.startIndex) / config.batchSize)}</strong>
            <br />
            ⏱️ Becsült idő: <strong>~{Math.ceil((config.endIndex - config.startIndex) * 30 / 60)} perc</strong>
          </p>
        </div>
        
        {/* Gyors beállítások */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setConfig({...config, startIndex: 0, endIndex: 10})}
            className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-xs hover:bg-yellow-200"
            disabled={isUploading}
          >
            🧪 Teszt (első 10)
          </button>
          <button
            onClick={() => setConfig({...config, startIndex: 0, endIndex: 100})}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
            disabled={isUploading}
          >
            🚀 Első 100
          </button>
          <button
            onClick={() => setConfig({...config, startIndex: 0, endIndex: dataInfo.count || 1000})}
            className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200"
            disabled={isUploading}
          >
            💯 Mind ({dataInfo.count || 'Betöltés...'})
          </button>
        </div>
      </div>

      {/* Kontrol gombok */}
      <div className="text-center mb-6">
        <button
          onClick={startUpload}
          disabled={isUploading}
          className={`px-8 py-3 rounded-lg font-semibold text-white mr-4 ${
            isUploading 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isUploading ? '🔄 Feltöltés folyamatban...' : '🚀 Feltöltés indítása'}
        </button>

        {results && (
          <button
            onClick={resetUpload}
            className="px-6 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          >
            🔄 Újrakezdés
          </button>
        )}
      </div>

      {/* Loading indikátor */}
      {isUploading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            <span className="ml-3 text-yellow-800 font-medium">Feltöltés folyamatban...</span>
          </div>
          
          <p className="text-sm text-yellow-700 text-center">
            ⚠️ Ne zárd be az oldalt! A folyamat hosszú időt vehet igénybe.
            <br />
            🔍 Nyisd meg a böngésző konzolt (F12) a részletes logokért.
          </p>
        </div>
      )}

      {/* Eredmények */}
      {results && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Feltöltés eredménye</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded text-center">
              <div className="text-2xl font-bold text-blue-600">{results.total}</div>
              <div className="text-sm text-blue-800">Összes</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded text-center">
              <div className="text-2xl font-bold text-green-600">{results.successful}</div>
              <div className="text-sm text-green-800">Sikeres</div>
            </div>
            
            <div className="bg-red-50 p-4 rounded text-center">
              <div className="text-2xl font-bold text-red-600">{results.failed}</div>
              <div className="text-sm text-red-800">Hibás</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((results.successful / results.total) * 100)}%
              </div>
              <div className="text-sm text-purple-800">Sikerességi arány</div>
            </div>
          </div>

          {/* Hibák listája */}
          {results.errors && results.errors.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3 text-red-800">❌ Hibák ({results.errors.length})</h3>
              <div className="bg-red-50 border border-red-200 rounded max-h-60 overflow-y-auto">
                {results.errors.map((error, index) => (
                  <div key={index} className="p-3 border-b border-red-100 last:border-b-0">
                    <div className="font-medium text-red-800">
                      Ingatlan ID: {error.propertyId}
                    </div>
                    <div className="text-sm text-red-600 mt-1">
                      {typeof error.error === 'string' ? error.error : JSON.stringify(error.error)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Siker üzenet */}
          {results.successful === results.total && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="text-green-600 text-xl mr-3">🎉</div>
                <div>
                  <div className="font-semibold text-green-800">
                    Minden ingatlan sikeresen feltöltve!
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    Mind a {results.total} ingatlan és képeik elérhetőek a Supabase-ben.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Útmutató */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">💡 Használati útmutató</h3>
        <ul className="text-sm space-y-2 text-gray-700">
          <li>• ✅ <code>kyero_properties.json</code> importálva - <strong>{dataInfo.count || 'Betöltés...'} ingatlan</strong></li>
          <li>• Állítsd be a Supabase környezeti változókat (.env.local fájlban)</li>
          <li>• Hozd létre a táblákat és a 'property-images' bucket-et Supabase-ben</li>
          <li>• 🧪 Kezd teszteléssel (első 10 ingatlan)</li>
          <li>• Figyeld a böngésző konzolt a részletes logokért</li>
          <li>• Nagy adathalmaznál oszd részletekre (pl. 0-100, 100-200, stb.)</li>
        </ul>
      </div>
    </div>
  )
}