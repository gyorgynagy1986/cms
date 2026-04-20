"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ApartmentUploadForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedImages, setSelectedImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  
  const [formData, setFormData] = useState({
    // Alapadatok
    title: '',
    description: '',
    price: '',
    currency: 'EUR',
    
    // Lokáció
    country: 'Hungary',
    province: '',
    town: '',
    postal_code: '',
    address: '',
    
    // Fizikai jellemzők
    bedrooms: '',
    bathrooms: '',
    surface_area: '',
    lot_size: '',
    
    // Tulajdonságok  
    property_type: 'Apartment',
    has_pool: false,
    has_garage: false,
    has_garden: false,
    has_terrace: false,
    energy_rating: '',
    condition: '',
    
    // Üzleti adatok
    listing_type: 'sale',
    available_from: '',
    agency_name: '',
    agent_name: '',
    agency_phone: '',
    agency_email: '',
    
    // Jellemzők (comma separated)
    features: ''
  })

  // Form mezők változása
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Képek kiválasztása
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    setSelectedImages(files)
    
    // Preview generálás
    const previews = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve({
          file,
          preview: reader.result,
          name: file.name
        })
        reader.readAsDataURL(file)
      })
    })
    
    Promise.all(previews).then(setImagePreviews)
  }

  // Kép eltávolítása
  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Képek feltöltése API-n keresztül
  const uploadImages = async (propertyId) => {
    if (selectedImages.length === 0) return []

    const formData = new FormData()
    formData.append('propertyId', propertyId)
    
    selectedImages.forEach(file => {
      formData.append('images', file)
    })

    const response = await fetch('/api/upload-images', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Képfeltöltési hiba')
    }

    const result = await response.json()
    if (!result.success) {
      throw new Error(result.error || 'Képfeltöltési hiba')
    }

    return result.images
  }

  // Form elküldése
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setUploadProgress(0)
    
    try {
      console.log('🏠 Apartman feltöltés kezdődik...')
      setUploadProgress(10)
      
      // 1. Apartman alapadatok feltöltése API-n keresztül
      const features = formData.features
        .split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0)

      const response = await fetch('/api/upload-apartment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyData: formData,
          features: features
        })
      })

      if (!response.ok) {
        throw new Error('Apartman feltöltési hiba')
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Apartman feltöltési hiba')
      }

      const insertedProperty = result.property
      console.log(`✅ Apartman mentve: ID ${insertedProperty.id}`)
      setUploadProgress(50)
      
      // 2. Képek feltöltése (ha vannak)
      if (selectedImages.length > 0) {
        console.log(`📸 ${selectedImages.length} kép feltöltése...`)
        
        for (let i = 0; i < selectedImages.length; i++) {
          setUploadProgress(50 + Math.round(((i + 1) / selectedImages.length) * 40)) // 50-90%
          await new Promise(resolve => setTimeout(resolve, 100)) // Progress animation
        }
        
        await uploadImages(insertedProperty.id)
        console.log(`✅ Képek feltöltve`)
      }
      
      setUploadProgress(100)
      
      console.log('🎉 Feltöltés sikeresen befejezve!')
      
      // Átirányítás az új apartmanhoz
      setTimeout(() => {
        router.push(`/apartments/${insertedProperty.id}`)
      }, 1000)
      
    } catch (error) {
      console.error('❌ Feltöltési hiba:', error)
      alert(`Hiba történt: ${error.message}`)
      setUploadProgress(0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🏠 Új Apartman Feltöltése
          </h1>
          
          {/* Progress bar */}
          {loading && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">Feltöltés folyamatban...</span>
                <span className="text-sm font-medium text-blue-700">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Alapadatok */}
            <div className="border-b pb-8">
              <h2 className="text-xl font-semibold mb-4">📋 Alapadatok</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cím *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="pl. Modern apartman panoráma kilátással"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leírás
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Részletes leírás az apartmanról..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ár *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="250000"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valuta
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="EUR">EUR</option>
                    <option value="HUF">HUF</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Típus
                  </label>
                  <select
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="Apartment">Apartman</option>
                    <option value="House">Ház</option>
                    <option value="Villa">Villa</option>
                    <option value="Studio">Stúdió</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hirdetés típusa
                  </label>
                  <select
                    name="listing_type"
                    value={formData.listing_type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="sale">Eladó</option>
                    <option value="rent">Kiadó</option>
                    <option value="both">Eladó és Kiadó</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* 2. Lokáció */}
            <div className="border-b pb-8">
              <h2 className="text-xl font-semibold mb-4">📍 Lokáció</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ország
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Hungary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Megye/Provincia
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Budapest"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Város *
                  </label>
                  <input
                    type="text"
                    name="town"
                    value={formData.town}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Budapest"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Irányítószám
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="1051"
                  />
                </div>
              </div>
            </div>
            
            {/* 3. Fizikai jellemzők */}
            <div className="border-b pb-8">
              <h2 className="text-xl font-semibold mb-4">🏗️ Fizikai jellemzők</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hálószobák
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="0"
                    max="20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fürdőszobák
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="0"
                    max="10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alapterület (m²)
                  </label>
                  <input
                    type="number"
                    name="surface_area"
                    value={formData.surface_area}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telek mérete (m²)
                  </label>
                  <input
                    type="number"
                    name="lot_size"
                    value={formData.lot_size}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            {/* 4. Tulajdonságok */}
            <div className="border-b pb-8">
              <h2 className="text-xl font-semibold mb-4">✨ Tulajdonságok</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="has_pool"
                    checked={formData.has_pool}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 mr-2"
                  />
                  🏊 Medence
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="has_garage"
                    checked={formData.has_garage}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 mr-2"
                  />
                  🚗 Garázs
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="has_garden"
                    checked={formData.has_garden}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 mr-2"
                  />
                  🌺 Kert
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="has_terrace"
                    checked={formData.has_terrace}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 mr-2"
                  />
                  🏡 Terasz
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Energetikai besorolás
                  </label>
                  <select
                    name="energy_rating"
                    value={formData.energy_rating}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Válassz...</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Állapot
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Válassz...</option>
                    <option value="Új">Új</option>
                    <option value="Kiváló">Kiváló</option>
                    <option value="Jó">Jó</option>
                    <option value="Felújítandó">Felújítandó</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* 5. Képek */}
            <div className="border-b pb-8">
              <h2 className="text-xl font-semibold mb-4">📸 Képek</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Képek kiválasztása
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Több kép is kiválasztható. Támogatott formátumok: JPG, PNG, WebP
                </p>
              </div>
              
              {/* Kép előnézetek */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
                        disabled={loading}
                      >
                        ×
                      </button>
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        {image.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* 6. Jellemzők */}
            <div className="border-b pb-8">
              <h2 className="text-xl font-semibold mb-4">🏷️ Jellemzők</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jellemzők (vesszővel elválasztva)
                </label>
                <input
                  type="text"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="pl. Lift, Balkon, Légkondicionáló, Beépített szekrény"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Példa: Lift, Balkon, Légkondicionáló, Panoráma kilátás
                </p>
              </div>
            </div>
            
            {/* 7. Kapcsolat */}
            <div className="border-b pb-8">
              <h2 className="text-xl font-semibold mb-4">📞 Kapcsolat</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ügynökség neve
                  </label>
                  <input
                    type="text"
                    name="agency_name"
                    value={formData.agency_name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Példa Ingatlan Kft."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ügyintéző neve
                  </label>
                  <input
                    type="text"
                    name="agent_name"
                    value={formData.agent_name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Nagy János"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="agency_phone"
                    value={formData.agency_phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="+36 20 123 4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="agency_email"
                    value={formData.agency_email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="info@pelda.hu"
                  />
                </div>
              </div>
            </div>
            
            {/* Submit gombok */}
            <div className="flex items-center justify-between pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
                disabled={loading}
              >
                ← Vissza
              </button>
              
              <button
                type="submit"
                disabled={loading || !formData.title.trim() || !formData.town.trim()}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {loading ? '⏳ Feltöltés...' : '🚀 Apartman Feltöltése'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}