"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function ApartmentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { slug } = params

  const [apartment, setApartment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showAllImages, setShowAllImages] = useState(false)

  useEffect(() => {
    if (slug) {
      loadApartmentDetails(slug)
    }
  }, [slug])

  const loadApartmentDetails = async (apartmentSlug) => {
    setLoading(true)
    
    try {
      // Slug lehet ID vagy external_id
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images!property_images_property_id_fkey (
            public_url,
            is_floorplan,
            display_order,
            original_url
          ),
          property_features!property_features_property_id_fkey (
            feature_name
          )
        `)
        .or(`id.eq.${apartmentSlug},external_id.eq.${apartmentSlug}`)
        .single()

      if (error) {
        console.error('Hiba az apartman betöltésekor:', error)
        return
      }

      if (!data) {
        router.push('/apartments')
        return
      }

      // Adatok feldolgozása
      const processedApartment = {
        ...data,
        allImages: data.property_images
          ?.filter(img => !img.is_floorplan)
          ?.sort((a, b) => a.display_order - b.display_order)
          ?.map(img => img.public_url) || [],
        floorplans: data.property_images
          ?.filter(img => img.is_floorplan)
          ?.sort((a, b) => a.display_order - b.display_order)
          ?.map(img => img.public_url) || [],
        features: data.property_features?.map(f => f.feature_name) || []
      }

      setApartment(processedApartment)
      
    } catch (error) {
      console.error('Általános hiba:', error)
      router.push('/apartments')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price, currency = 'EUR') => {
    return new Intl.NumberFormat('hu-HU').format(price) + ' ' + currency
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('hu-HU')
  }

  const nextImage = () => {
    if (apartment.allImages.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === apartment.allImages.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (apartment.allImages.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? apartment.allImages.length - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="h-8 bg-gray-200 rounded mb-4 max-w-md"></div>
            <div className="h-4 bg-gray-200 rounded mb-8 max-w-sm"></div>
            
            {/* Image skeleton */}
            <div className="w-full h-96 bg-gray-200 rounded-lg mb-8"></div>
            
            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!apartment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Apartman nem található</h1>
          <p className="text-gray-600 mb-6">A keresett apartman nem létezik vagy el lett távolítva.</p>
          <Link href="/apartments" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            ← Vissza a listához
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/apartments" className="hover:text-blue-600">🏠 Apartmanok</Link>
            <span>→</span>
            <span className="text-gray-900">{apartment.town}</span>
            <span>→</span>
            <span className="text-gray-900 font-medium">#{apartment.external_id}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {apartment.title}
          </h1>
          <div className="flex items-center space-x-4 text-gray-600">
            <span className="flex items-center">
              📍 {apartment.town}, {apartment.province}, {apartment.country}
            </span>
            <span>•</span>
            <span>📅 Feltöltve: {formatDate(apartment.created_at)}</span>
          </div>
        </div>

        {/* Képgaléria */}
        <div className="mb-8">
          {apartment.allImages.length > 0 ? (
            <div className="relative">
              {/* Főkép */}
              <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={apartment.allImages[currentImageIndex]}
                  alt={apartment.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation arrows */}
                {apartment.allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      →
                    </button>
                  </>
                )}
                
                {/* Kép számláló */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {apartment.allImages.length}
                </div>
                
                {/* Ár badge */}
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full text-xl font-bold">
                  {formatPrice(apartment.price, apartment.currency)}
                </div>
              </div>
              
              {/* Thumbnail galéria */}
              {apartment.allImages.length > 1 && (
                <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                  {apartment.allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index ? 'border-blue-600' : 'border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${apartment.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              📷 Nincs elérhető kép
            </div>
          )}
        </div>

        {/* Tartalom */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bal oldal - Leírás és részletek */}
          <div className="lg:col-span-2">
            {/* Leírás */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">📝 Leírás</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {apartment.description || 'Nincs részletes leírás.'}
              </div>
            </div>

            {/* Jellemzők */}
            {apartment.features.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">🏷️ Jellemzők</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {apartment.features.map((feature, index) => (
                    <div key={index} className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm">
                      ✓ {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alaprajzok */}
            {apartment.floorplans.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">📐 Alaprajzok</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {apartment.floorplans.map((floorplan, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <img
                        src={floorplan}
                        alt={`Alaprajz ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Jobb oldal - Információk */}
          <div className="space-y-6">
            {/* Árazás */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">💰 Árazás</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatPrice(apartment.price, apartment.currency)}
              </div>
              <div className="text-sm text-gray-600">
                {apartment.price_frequency === 'sale' ? 'Eladási ár' : 'Bérleti díj'}
              </div>
            </div>

            {/* Alapadatok */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">ℹ️ Alapadatok</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">🛏️ Hálószobák:</span>
                  <span className="font-medium">{apartment.bedrooms || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">🚿 Fürdőszobák:</span>
                  <span className="font-medium">{apartment.bathrooms || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">📐 Alapterület:</span>
                  <span className="font-medium">{apartment.surface_area} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">🏊 Medence:</span>
                  <span className={apartment.has_pool ? 'text-green-600' : 'text-red-600'}>
                    {apartment.has_pool ? '✓ Van' : '✗ Nincs'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">🆕 Új építésű:</span>
                  <span className={apartment.new_build ? 'text-green-600' : 'text-gray-600'}>
                    {apartment.new_build ? '✓ Igen' : '✗ Nem'}
                  </span>
                </div>
                {apartment.energy_rating && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">⚡ Energetikai:</span>
                    <span className="font-medium">{apartment.energy_rating}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Lokáció */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">📍 Lokáció</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Város:</strong> {apartment.town}</div>
                <div><strong>Megye:</strong> {apartment.province}</div>
                <div><strong>Ország:</strong> {apartment.country}</div>
                {apartment.postal_code && (
                  <div><strong>Irányítószám:</strong> {apartment.postal_code}</div>
                )}
                {apartment.location_detail && (
                  <div><strong>Részletek:</strong> {apartment.location_detail}</div>
                )}
              </div>
            </div>

            {/* Kapcsolat */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">📞 Kapcsolat</h3>
              <div className="space-y-3 text-sm">
                {apartment.agency_name && (
                  <div>
                    <div className="text-gray-600">Ügynökség:</div>
                    <div className="font-medium">{apartment.agency_name}</div>
                  </div>
                )}
                {apartment.agency_email && (
                  <div>
                    <div className="text-gray-600">Email:</div>
                    <a href={`mailto:${apartment.agency_email}`} className="text-blue-600 hover:underline">
                      {apartment.agency_email}
                    </a>
                  </div>
                )}
                {apartment.agency_phone && (
                  <div>
                    <div className="text-gray-600">Telefon:</div>
                    <a href={`tel:${apartment.agency_phone}`} className="text-blue-600 hover:underline">
                      {apartment.agency_phone}
                    </a>
                  </div>
                )}
                {apartment.listing_url && (
                  <div className="pt-2">
                    <a
                      href={apartment.listing_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700 w-full"
                    >
                      🔗 Eredeti hirdetés
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Referencia */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500">
                Referencia ID: {apartment.external_id}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Belső ID: {apartment.id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}